import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import eventsEngine from '../../events/core/events_engine';
import { Deferred, when } from '../../core/utils/deferred';

import Widget from '../widget/ui.widget';
import Button from '../button';
import ProgressBar from '../progress_bar';
import Popup from '../popup';

const FILE_MANAGER_FILE_UPLOADER_CLASS = 'dx-filemanager-fileuploader';
const FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS = FILE_MANAGER_FILE_UPLOADER_CLASS + '-fileinput';

const FILE_MANAGER_PROGRESS_PANEL = 'dx-filemanager-progresspanel';

const FILE_MANAGER_PROGRESS_BOX = 'dx-filemanager-progressbox';
const FILE_MANAGER_PROGRESS_BOX_TITLE = FILE_MANAGER_PROGRESS_BOX + '-title';
const FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR = FILE_MANAGER_PROGRESS_BOX + '-progressbar';
const FILE_MANAGER_PROGRESS_BOX_CANCEL_BUTTON = FILE_MANAGER_PROGRESS_BOX + '-cancel-button';

class FileManagerFileUploader extends Widget {

    _initMarkup() {
        this._initActions();

        this._progressPanel = this._createComponent($('<div>'), FileManagerUploadProgressPanel, {});

        this.$element()
            .addClass(FILE_MANAGER_FILE_UPLOADER_CLASS)
            .append(this._progressPanel.$element());

        this._renderFileInput();

        super._initMarkup();
    }

    _renderFileInput() {
        this._$fileInput = $('<input>')
            .attr('type', 'file')
            .prop({
                multiple: 'multiple',
                tabIndex: -1
            })
            .addClass(FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS);

        eventsEngine.on(this._$fileInput, 'change', this._onFileInputChange.bind(this));
        eventsEngine.on(this._$fileInput, 'click', e => {
            e.stopPropagation();
            return true;
        });

        this.$element().append(this._$fileInput);
    }

    _onFileInputChange() {
        const files = this._$fileInput.prop('files');
        if(files.length === 0) {
            return;
        }

        eventsEngine.off(this._$fileInput, 'change');
        eventsEngine.off(this._$fileInput, 'click');

        const $fileInput = this._$fileInput;
        this._uploadFiles(files).always(() => {
            setTimeout(() => {
                $fileInput.remove();
            });
        });

        this._renderFileInput();
    }

    _uploadFiles(files) {
        if(files.length === 0) {
            return;
        }

        const progressBoxTitle = `Uploading ${files.length} files`;
        const progressBox = this._progressPanel.addProgressBox(progressBoxTitle, null);

        const controllerGetter = this.option('getController');
        const session = new FileManagerUploadSession({
            controller: controllerGetter(),
            onProgress: value => progressBox.updateProgress(value * 100),
            onError: reason => this._raiseOnErrorOccurred(reason)
        });

        progressBox.option('onCancel', () => session.cancelUpload());

        const deferreds = session.uploadFiles(files);

        return when.apply(null, deferreds).then(function() {
            this._progressPanel.removeProgressBox(progressBox);

            const results = [].slice.call(arguments);
            if(results.some(res => res.success)) {
                this._onFilesUploaded();
            }
        }.bind(this));
    }

    tryUpload() {
        this._$fileInput.click();
    }

    _onFilesUploaded() {
        this._actions.onFilesUploaded();
    }

    _raiseOnErrorOccurred(args) {
        this._actions.onErrorOccurred({ info: args });
    }

    _initActions() {
        this._actions = {
            onFilesUploaded: this._createActionByOption('onFilesUploaded'),
            onErrorOccurred: this._createActionByOption('onErrorOccurred')
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getController: null,
            onFilesUploaded: null,
            onErrorOccurred: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'getController':
                this.repaint();
                break;
            case 'onFilesUploaded':
            case 'onErrorOccurred':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

}

class FileManagerUploadSession {
    constructor(options) {
        this._controller = options.controller;
        this._onProgressHandler = options.onProgress;
        this._onErrorHandler = options.onError;
        this._canceled = false;
    }

    uploadFiles(files) {
        const progressInfo = {
            uploadedBytesCount: 0,
            totalBytesCount: 0
        };

        for(let j = 0; j < files.length; j++) {
            progressInfo.totalBytesCount += files[j].size;
        }

        const result = [];
        for(let i = 0; i < files.length; i++) {
            const deferred = this._uploadFile(files[i], progressInfo);
            result.push(deferred);
        }

        return result;
    }

    cancelUpload() {
        this._canceled = true;
    }

    _uploadFile(file, progressInfo) {
        const state = this._createUploadingState(file);

        return this._controller.initiateUpload(state)
            .then(() => this._uploadChunks(state, progressInfo))
            .then(() => this._finalizeUpload(state),
                reason => {
                    if(reason && reason.canceled) {
                        return this._abortUpload(state);
                    } else {
                        return this._handleError(reason, file);
                    }
                })
            .catch(reason => this._handleError(reason, file));
    }

    _uploadChunks(state, progressInfo) {
        if(this._canceled) {
            const reason = this._createResultInfo(state.file.name, false, true);
            return new Deferred().reject(reason).promise();
        }

        const chunk = this._getChunk(state);
        if(!chunk) {
            return new Deferred().resolve().promise();
        }

        return this._controller.uploadChunk(state, chunk)
            .done(() => {
                state.uploadedBytesCount += chunk.size;
                state.uploadedChunksCount++;
                progressInfo.uploadedBytesCount += chunk.size;
                this._raiseOnProgress(progressInfo);
            })
            .then(() => this._uploadChunks(state, progressInfo));
    }

    _getChunk(state) {
        const bytesLeft = state.file.size - state.uploadedBytesCount;

        if(bytesLeft === 0) {
            return null;
        }

        const chunkSize = Math.min(bytesLeft, this._controller.chunkSize);
        const blob = state.file.slice(state.uploadedBytesCount, state.uploadedBytesCount + chunkSize);

        return {
            index: state.uploadedChunksCount,
            size: chunkSize,
            blob
        };
    }

    _finalizeUpload(state) {
        return this._controller.finalizeUpload(state)
            .then(() => this._createResultInfo(state.file.name, true));
    }

    _abortUpload(state) {
        return this._controller.abortUpload(state)
            .then(() => this._createResultInfo(state.file.name, false, true));
    }

    _handleError(error, file) {
        const result = this._createResultInfo(file.name, false, false, error);
        this._onErrorHandler(result);
        return result;
    }

    _raiseOnProgress(info) {
        const value = info.totalBytesCount !== 0 ? info.uploadedBytesCount / info.totalBytesCount : 1;
        this._onProgressHandler(value);
    }

    _createUploadingState(file) {
        const chunkCount = Math.ceil(file.size / this._controller.chunkSize);

        return {
            file,
            uploadedBytesCount: 0,
            uploadedChunksCount: 0,
            totalChunkCount: chunkCount,
            customData: {}
        };
    }

    _createResultInfo(fileName, success, canceled, error) {
        return {
            fileName,
            success: success || false,
            canceled: canceled || false,
            error: error || null
        };
    }

}

class FileManagerUploadProgressPanel extends Widget {

    _init() {
        this._progressBoxCount = 0;
        super._init();
    }

    _initMarkup() {
        this._popup = this._createComponent(this.$element(), Popup, {
            width: 200,
            height: 145,
            position: 'right bottom',
            showTitle: false,
            visible: false,
            shading: false,
            deferRendering: false,
            closeOnOutsideClick: false,
            contentTemplate: this._getPopupContentTemplate.bind(this)
        });

        super._initMarkup();
    }

    addProgressBox(title, onCancel) {
        const progressBox = this._createComponent($('<div>'), FileManagerUploadProgressBox, {
            title,
            onCancel
        });
        this._$container.append(progressBox.$element());

        if(this._progressBoxCount === 0) {
            this._popup.show();
        }

        this._progressBoxCount++;

        return progressBox;
    }

    removeProgressBox(progressBox) {
        if(this._progressBoxCount === 1) {
            this._popup.hide();
        }

        this._progressBoxCount--;

        progressBox.dispose();
        progressBox.$element().remove();
    }

    _getPopupContentTemplate() {
        this._$container = $('<div>').addClass(FILE_MANAGER_PROGRESS_PANEL);
        return this._$container;
    }

}

class FileManagerUploadProgressBox extends Widget {

    _initMarkup() {
        this._createOnCancelAction();

        const titleText = this.option('title');
        const $title = $('<span>').text(titleText).addClass(FILE_MANAGER_PROGRESS_BOX_TITLE);

        this._cancelButton = this._createComponent($('<div>'), Button, {
            text: 'Cancel',
            onClick: this._onCancelButtonClick.bind(this)
        });
        this._cancelButton.$element().addClass(FILE_MANAGER_PROGRESS_BOX_CANCEL_BUTTON);

        this._progressBar = this._createComponent($('<div>'), ProgressBar, {
            min: 0,
            max: 100,
            width: '100%',
            showStatus: false
        });
        this._progressBar.$element().addClass(FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR);

        this.$element().addClass(FILE_MANAGER_PROGRESS_BOX);
        this.$element().append(
            $title,
            this._progressBar.$element(),
            this._cancelButton.$element()
        );

        super._initMarkup();
    }

    updateProgress(value) {
        this._progressBar.option('value', value);
    }

    _onCancelButtonClick() {
        this._cancelButton.option({
            disabled: true,
            text: 'Canceling...'
        });

        this._onCancelAction();
    }

    _createOnCancelAction() {
        this._onCancelAction = this._createActionByOption('onCancel');
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            title: '',
            onCancel: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'title':
                this.repaint();
                break;
            case 'onCancel':
                this._createOnCancelAction();
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerFileUploader;
