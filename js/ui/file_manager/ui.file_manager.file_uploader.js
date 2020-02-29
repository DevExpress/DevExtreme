import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import { isDefined } from '../../core/utils/type';
import Guid from '../../core/guid';

import Widget from '../widget/ui.widget';
import FileUploader from '../file_uploader';

import whenSome from './ui.file_manager.common';

const FILE_MANAGER_FILE_UPLOADER_CLASS = 'dx-filemanager-fileuploader';

class FileManagerFileUploader extends Widget {

    _initMarkup() {
        this._initActions();

        this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);

        this._uploaderInfos = [];

        this._createInternalFileUploader();

        super._initMarkup();
    }

    _createInternalFileUploader() {
        const chunkSize = this._getController().chunkSize;

        const $fileUploader = $('<div>')
            .appendTo(this.$element());

        const fileUploader = this._createComponent($fileUploader, FileUploader, {
            name: 'file',
            multiple: true,
            showFileList: false,
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            labelText: '',
            readyToUploadMessage: '',
            accept: '*',
            chunkSize,
            onValueChanged: e => this._onFileUploaderValueChanged(e),
            onProgress: e => this._onFileUploaderProgress(e),
            onUploaded: e => this._onFileUploaderUploaded(e),
            onUploadAborted: e => this._onFileUploaderUploadAborted(e),
            onUploadError: e => this._onFileUploaderUploadError(e)
        });

        fileUploader.option({
            uploadChunk: (file, chunksData) => this._fileUploaderUploadChunk(fileUploader, file, chunksData),
            abortUpload: (file, chunksData) => this._fileUploaderAbortUpload(fileUploader, file, chunksData)
        });

        const uploaderInfo = {
            fileUploader
        };

        this._uploaderInfos.push(uploaderInfo);
    }

    tryUpload() {
        const info = this._findAvailableUploaderInfo();
        if(info) {
            info.fileUploader._selectButtonClickHandler();
        }
    }

    cancelUpload(sessionId) {
        this._cancelUpload(sessionId);
    }

    cancelFileUpload(sessionId, fileIndex) {
        this._cancelUpload(sessionId, fileIndex);
    }

    _cancelUpload(sessionId, fileIndex) {
        const { fileUploader } = this._findUploaderInfoBySessionId(sessionId);
        const files = isDefined(fileIndex) ? [ fileUploader._files[fileIndex] ] : fileUploader._files;
        fileUploader._preventFilesUploading(files);
    }

    _fileUploaderUploadChunk(fileUploader, file, chunksInfo) {
        const { session, fileIndex } = this._findSessionByFile(fileUploader, file);
        const controller = session.controller;
        chunksInfo.fileIndex = fileIndex;
        return controller.uploadFileChunk(file, chunksInfo);
    }

    _fileUploaderAbortUpload(fileUploader, file, chunksInfo) {
        const { session, fileIndex } = this._findSessionByFile(fileUploader, file);
        const controller = session.controller;
        chunksInfo.fileIndex = fileIndex;
        return controller.abortFileUpload(file, chunksInfo);
    }

    _onFileUploaderValueChanged({ component, value }) {
        if(value.length === 0) {
            return;
        }

        const files = value.slice();
        const uploaderInfo = this._findUploaderInfo(component);
        this._uploadFiles(uploaderInfo, files);

        setTimeout(() => {
            if(!this._findAvailableUploaderInfo()) {
                this._createInternalFileUploader();
            }
        });
    }

    _onFileUploaderProgress({ component, file, bytesLoaded, bytesTotal }) {
        const { session, fileIndex } = this._findSessionByFile(component, file);

        const fileValue = bytesTotal !== 0 ? bytesLoaded / bytesTotal : 1;
        const commonValue = component.option('progress') / 100;

        const args = {
            sessionId: session.id,
            fileIndex,
            commonValue,
            fileValue
        };
        this._raiseUploadProgress(args);
    }

    _onFileUploaderUploaded({ component, file }) {
        const deferred = this._getDeferredForFile(component, file);
        deferred.resolve();
    }

    _onFileUploaderUploadAborted({ component, file }) {
        const deferred = this._getDeferredForFile(component, file);
        deferred.resolve({ canceled: true });
    }

    _onFileUploaderUploadError({ component, file, error }) {
        const deferred = this._getDeferredForFile(component, file);
        deferred.reject(error);
    }

    _uploadFiles(uploaderInfo, files) {
        const sessionId = new Guid().toString();
        const controller = this._getController();
        const deferreds = files.map(() => new Deferred());
        const session = {
            id: sessionId,
            controller,
            files,
            deferreds
        };

        uploaderInfo.session = session;

        const sessionInfo = { sessionId, deferreds, files };
        this._raiseUploadSessionStarted(sessionInfo);

        return whenSome(deferreds).always(() => setTimeout(() => {
            uploaderInfo.fileUploader.option('value', []);
            uploaderInfo.session = null;
        }));
    }

    _getDeferredForFile(fileUploader, file) {
        const { session, fileIndex } = this._findSessionByFile(fileUploader, file);
        return session.deferreds[fileIndex];
    }

    _findSessionByFile(fileUploader, file) {
        const uploaderInfo = this._findUploaderInfo(fileUploader);
        const session = uploaderInfo.session;
        const fileIndex = session.files.indexOf(file);
        return { session, fileIndex };
    }

    _findUploaderInfoBySessionId(sessionId) {
        for(let i = 0; i < this._uploaderInfos.length; i++) {
            const uploaderInfo = this._uploaderInfos[i];
            const session = uploaderInfo.session;

            if(session && session.id === sessionId) {
                return uploaderInfo;
            }
        }

        return null;
    }

    _findAvailableUploaderInfo() {
        for(let i = 0; i < this._uploaderInfos.length; i++) {
            const info = this._uploaderInfos[i];
            if(!info.session) {
                return info;
            }
        }
        return null;
    }

    _findUploaderInfo(fileUploader) {
        for(let i = 0; i < this._uploaderInfos.length; i++) {
            const info = this._uploaderInfos[i];
            if(info.fileUploader === fileUploader) {
                return info;
            }
        }
        return null;
    }

    _getController() {
        const controllerGetter = this.option('getController');
        return controllerGetter();
    }

    _raiseUploadSessionStarted(sessionInfo) {
        this._actions.onUploadSessionStarted({ sessionInfo });
    }

    _raiseUploadProgress(args) {
        this._actions.onUploadProgress(args);
    }

    _initActions() {
        this._actions = {
            onUploadSessionStarted: this._createActionByOption('onUploadSessionStarted'),
            onUploadProgress: this._createActionByOption('onUploadProgress')
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getController: null,
            onUploadSessionStarted: null,
            onUploadProgress: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'getController':
                this.repaint();
                break;
            case 'onUploadSessionStarted':
            case 'onUploadProgress':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerFileUploader;
