import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { Deferred, when } from "../../core/utils/deferred";
import Class from "../../core/class";

import Widget from "../widget/ui.widget";
import Button from "../button";
import ProgressBar from "../progress_bar";
import Popup from "../popup";

const FILE_MANAGER_FILE_UPLOADER_CLASS = "dx-filemanager-fileuploader";
const FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS = FILE_MANAGER_FILE_UPLOADER_CLASS + "-fileinput";

const FILE_MANAGER_PROGRESS_PANEL = "dx-filemanager-progresspanel";

const FILE_MANAGER_PROGRESS_BOX = "dx-filemanager-progressbox";
const FILE_MANAGER_PROGRESS_BOX_TITLE = FILE_MANAGER_PROGRESS_BOX + "-title";
const FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR = FILE_MANAGER_PROGRESS_BOX + "-progressbar";
const FILE_MANAGER_PROGRESS_BOX_CANCEL_BUTTON = FILE_MANAGER_PROGRESS_BOX + "-cancel-button";

var FileManagerFileUploader = Widget.inherit({

    _initMarkup: function() {
        this._progressPanel = this._createComponent($("<div>"), FileManagerUploadProgressPanel, {});
        this.$element().append(this._progressPanel.$element());

        this._renderFileInput();

        this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);

        this.callBase();
    },

    _renderFileInput: function() {
        this._$fileInput = $("<input>")
            .attr("type", "file")
            .prop({
                multiple: "multiple",
                tabIndex: -1
            })
            .addClass(FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS);

        eventsEngine.on(this._$fileInput, "change", this._onFileInputChange.bind(this));
        eventsEngine.on(this._$fileInput, "click", e => {
            e.stopPropagation();
            return true;
        });

        this.$element().append(this._$fileInput);
    },

    _onFileInputChange: function() {
        var files = this._$fileInput.prop("files");
        if(files.length === 0) return;

        eventsEngine.off(this._$fileInput, "change");
        eventsEngine.off(this._$fileInput, "click");

        var $fileInput = this._$fileInput;
        this._uploadFiles(files).always(() => {
            setTimeout(() => {
                $fileInput.remove();
            });
        });

        this._renderFileInput();
    },

    _uploadFiles: function(files) {
        if(files.length === 0) return;

        var progressBoxTitle = `Uploading ${files.length} files`;
        var progressBox = this._progressPanel.addProgressBox(progressBoxTitle, null);

        var controllerGetter = this.option("onGetController");
        var session = new FileManagerUploadSession({
            controller: controllerGetter(),
            onProgress: value => progressBox.updateProgress(value * 100),
            onError: reason => this._raiseOnErrorOccurred(reason)
        });

        progressBox.option("onCancel", () => session.cancelUpload());

        var deferreds = session.uploadFiles(files);

        return when.apply(null, deferreds).then(function() {
            this._progressPanel.removeProgressBox(progressBox);

            var results = [].slice.call(arguments);
            if(results.some(res => res.success)) {
                this._onFilesUploaded();
            }
        }.bind(this));
    },

    tryUpload: function() {
        this._$fileInput.click();
    },

    _onFilesUploaded: function() {
        this._raiseOnFilesUploaded();
    },

    _raiseOnErrorOccurred: function(args) {
        this._raiseEvent("ErrorOccurred", args);
    },

    _raiseOnFilesUploaded: function() {
        this._raiseEvent("FilesUploaded");
    },

    _raiseEvent: function(eventName, argument) {
        var optionName = "on" + eventName;
        var handler = this.option(optionName);
        if(handler) handler.call(this, argument);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onGetController: null,
            onFilesUploaded: null,
            onErrorOccurred: null
        });
    }

});

var FileManagerUploadSession = Class.inherit({
    ctor: function(options) {
        this._controller = options.controller;
        this._onProgressHandler = options.onProgress;
        this._onErrorHandler = options.onError;
        this._canceled = false;
    },

    uploadFiles: function(files) {
        var progressInfo = {
            uploadedBytesCount: 0,
            totalBytesCount: 0
        };

        for(var j = 0; j < files.length; j++) {
            progressInfo.totalBytesCount += files[j].size;
        }

        var result = [];
        for(var i = 0; i < files.length; i++) {
            var deferred = this._uploadFile(files[i], progressInfo);
            result.push(deferred);
        }

        return result;
    },

    cancelUpload: function() {
        this._canceled = true;
    },

    _uploadFile: function(file, progressInfo) {
        var state = this._createUploadingState(file);

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
    },

    _uploadChunks: function(state, progressInfo) {
        if(this._canceled) {
            var reason = this._createResultInfo(state.file.name, false, true);
            return new Deferred().reject(reason).promise();
        }

        var chunk = this._getChunk(state);
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
    },

    _getChunk: function(state) {
        var bytesLeft = state.file.size - state.uploadedBytesCount;

        if(bytesLeft === 0) return null;

        var chunkSize = Math.min(bytesLeft, this._controller.chunkSize);
        var blob = state.file.slice(state.uploadedBytesCount, state.uploadedBytesCount + chunkSize);

        return {
            index: state.uploadedChunksCount,
            size: chunkSize,
            blob: blob
        };
    },

    _finalizeUpload: function(state) {
        return this._controller.finalizeUpload(state)
            .then(() => this._createResultInfo(state.file.name, true));
    },

    _abortUpload: function(state) {
        return this._controller.abortUpload(state)
            .then(() => this._createResultInfo(state.file.name, false, true));
    },

    _handleError: function(error, file) {
        var result = this._createResultInfo(file.name, false, false, error);
        this._onErrorHandler(result);
        return result;
    },

    _raiseOnProgress: function(info) {
        var value = info.totalBytesCount !== 0 ? info.uploadedBytesCount / info.totalBytesCount : 1;
        this._onProgressHandler(value);
    },

    _createUploadingState: function(file) {
        var chunkCount = Math.ceil(file.size / this._controller.chunkSize);

        return {
            file: file,
            uploadedBytesCount: 0,
            uploadedChunksCount: 0,
            totalChunkCount: chunkCount,
            customData: {}
        };
    },

    _createResultInfo: function(fileName, success, canceled, error) {
        return {
            fileName: fileName,
            success: success || false,
            canceled: canceled || false,
            error: error || null
        };
    }

});

var FileManagerUploadProgressPanel = Widget.inherit({

    _init: function() {
        this._progressBoxCount = 0;
        this.callBase();
    },

    _initMarkup: function() {
        this._popup = this._createComponent(this.$element(), Popup, {
            width: 200,
            height: 145,
            position: "right bottom",
            showTitle: false,
            visible: false,
            shading: false,
            deferRendering: false,
            closeOnOutsideClick: false,
            contentTemplate: this._getPopupContentTemplate.bind(this)
        });

        this.callBase();
    },

    addProgressBox: function(title, onCancel) {
        var progressBox = this._createComponent($("<div>"), FileManagerUploadProgressBox, {
            title: title,
            onCancel: onCancel
        });
        this._$container.append(progressBox.$element());

        if(this._progressBoxCount === 0) {
            this._popup.show();
        }

        this._progressBoxCount++;

        return progressBox;
    },

    removeProgressBox: function(progressBox) {
        if(this._progressBoxCount === 1) {
            this._popup.hide();
        }

        this._progressBoxCount--;

        progressBox.dispose();
        progressBox.$element().remove();
    },

    _getPopupContentTemplate: function() {
        this._$container = $("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL);
        return this._$container;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onTest: null // TODO remove
        });
    }

});

var FileManagerUploadProgressBox = Widget.inherit({

    _initMarkup: function() {
        var titleText = this.option("title");
        var $title = $("<span>").text(titleText).addClass(FILE_MANAGER_PROGRESS_BOX_TITLE);

        this._cancelButton = this._createComponent($("<div>"), Button, {
            text: "Cancel",
            onClick: this._onCancelButtonClick.bind(this)
        });
        this._cancelButton.$element().addClass(FILE_MANAGER_PROGRESS_BOX_CANCEL_BUTTON);

        this._progressBar = this._createComponent($("<div>"), ProgressBar, {
            min: 0,
            max: 100,
            width: "100%",
            showStatus: false
        });
        this._progressBar.$element().addClass(FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR);

        this.$element().addClass(FILE_MANAGER_PROGRESS_BOX);
        this.$element().append(
            $title,
            this._progressBar.$element(),
            this._cancelButton.$element()
        );

        this.callBase();
    },

    updateProgress: function(value) {
        this._progressBar.option("value", value);
    },

    _onCancelButtonClick: function() {
        this._cancelButton.option({
            disabled: true,
            text: "Canceling..."
        });

        this._raiseCancel();
    },

    _raiseCancel: function() {
        var handler = this.option("onCancel");
        if(handler) handler();
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            title: "",
            onCancel: null
        });
    }

});

module.exports = FileManagerFileUploader;
