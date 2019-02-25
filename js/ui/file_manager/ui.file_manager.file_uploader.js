import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { Deferred, when } from "../../core/utils/deferred";
import Class from "../../core/class";

import Widget from "../widget/ui.widget";

const FILE_MANAGER_FILE_UPLOADER_CLASS = "dx-filemanager-fileuploader";

var FileManagerFileUploader = Widget.inherit({

    _initMarkup: function() {
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
            });

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

        var getControllerAction = this.option("onGetController");
        var controller = getControllerAction();
        var session = new FileManagerUploadSession(controller);
        var results = session.uploadFiles(files);

        var that = this;
        var deferreds = results.map(result => {
            return result.deferred.catch(reason => {
                if(!reason || !reason.canceled) {
                    var args = {
                        fileName: result.fileName,
                        error: reason,
                        success: false
                    };
                    that._raiseOnErrorOccurred(args);
                }
                return reason;
            });
        });
        return when.apply(null, deferreds).then(this._onFilesUploaded.bind(this));
    },

    tryUpload: function() {
        this._$fileInput.click();
    },

    _onFilesUploaded: function(results) {
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
    ctor: function(controller) {
        this._controller = controller;
        this._canceled = false;
    },

    uploadFiles: function(files) {
        var result = [];
        for(var file, i = 0; file = files[i]; i++) {
            var deferred = this._uploadFile(file);
            result.push({
                deferred: deferred,
                fileName: file.name
            });
        }
        return result;
    },

    _uploadFile: function(file) {
        var that = this;
        var state = this._createUploadingState(file);
        return this._controller.initiateUpload(state)
            .then(() => { return that._uploadChunks(state); })
            .then(() => { return that._controller.finalizeUpload(state); },
                reason => {
                    if(reason && reason.canceled) {
                        that._controller.abortUpload(state);
                    }
                    return reason;
                });
    },

    _uploadChunks: function(state) {
        if(this._canceled) {
            var reason = { canceled: true };
            return new Deferred().reject(reason).promise();
        }

        var chunk = this._getChunk(state);
        if(!chunk) {
            return new Deferred().resolve().promise();
        }

        var that = this;
        return this._controller.uploadChunk(state, chunk)
            .done(() => {
                state.uploadedBytesCount += chunk.size;
                state.uploadedChunksCount++;
            })
            .then(() => { return that._uploadChunks(state); });
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

    _createUploadingState: function(file) {
        return {
            file: file,
            uploadedBytesCount: 0,
            uploadedChunksCount: 0,
            customData: {}
        };
    },

    _createFailedFileResponse: function(file, error) {
        return {
            name: file.name,
            error: error,
            failed: true
        };
    }

});

module.exports = FileManagerFileUploader;
