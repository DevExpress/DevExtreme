import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { Deferred } from "../../core/utils/deferred";

import Widget from "../widget/ui.widget";
import Guid from "../../core/guid";

import whenSome from "./ui.file_manager.common";

const FILE_MANAGER_FILE_UPLOADER_CLASS = "dx-filemanager-fileuploader";
const FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS = FILE_MANAGER_FILE_UPLOADER_CLASS + "-fileinput";

class FileManagerFileUploader extends Widget {

    _initMarkup() {
        this._initActions();

        this._sessionMap = {};

        this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);

        this._renderFileInput();

        super._initMarkup();
    }

    _renderFileInput() {
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
    }

    _onFileInputChange() {
        const files = this._$fileInput.prop("files");
        if(files.length === 0) {
            return;
        }

        eventsEngine.off(this._$fileInput, "change");
        eventsEngine.off(this._$fileInput, "click");

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

        const sessionId = new Guid().toString();
        const controllerGetter = this.option("getController");
        const session = new FileManagerUploadSession({
            id: sessionId,
            controller: controllerGetter(),
            onProgress: e => {
                e.sessionId = sessionId;
                this._raiseUploadProgress(e);
            },
            onError: reason => this._raiseOnErrorOccurred(reason)
        });

        this._sessionMap[sessionId] = session;

        const deferreds = session.uploadFiles(files);
        const sessionInfo = { sessionId, deferreds, files };

        this._raiseUploadSessionStarted(sessionInfo);

        return whenSome(deferreds).always(() => {
            setTimeout(() => {
                delete this._sessionMap[sessionId];
            });
        });
    }

    _getSession(id) {
        return this._sessionMap[id];
    }

    tryUpload() {
        this._$fileInput.click();
    }

    cancelUpload(sessionId) {
        const session = this._getSession(sessionId);
        if(session) {
            session.cancelUpload();
        }
    }

    cancelFileUpload(sessionId, fileIndex) {
        const session = this._getSession(sessionId);
        if(session) {
            session.cancelFileUpload(fileIndex);
        }
    }

    _onFilesUploaded() {
        this._actions.onFilesUploaded();
    }

    _raiseOnErrorOccurred(args) {
        this._actions.onErrorOccurred({ info: args });
    }

    _raiseUploadSessionStarted(sessionInfo) {
        this._actions.onUploadSessionStarted({ sessionInfo });
    }

    _raiseUploadProgress(args) {
        this._actions.onUploadProgress(args);
    }

    _initActions() {
        this._actions = {
            onUploadSessionStarted: this._createActionByOption("onUploadSessionStarted"),
            onUploadProgress: this._createActionByOption("onUploadProgress"),
            onFilesUploaded: this._createActionByOption("onFilesUploaded"),
            onErrorOccurred: this._createActionByOption("onErrorOccurred")
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getController: null,
            onUploadSessionStarted: null,
            onUploadProgress: null,
            onFilesUploaded: null,
            onErrorOccurred: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "getController":
                this.repaint();
                break;
            case "onFilesUploaded":
            case "onErrorOccurred":
            case "onUploadSessionStarted":
            case "onUploadProgress":
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
        this._cancellationState = {};
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
            const deferred = this._uploadFile(files[i], i, progressInfo);
            result.push(deferred);
        }

        return result;
    }

    cancelUpload() {
        this._canceled = true;
    }

    cancelFileUpload(fileIndex) {
        this._cancellationState[fileIndex] = true;
    }

    _uploadFile(file, fileIndex, progressInfo) {
        const state = this._createUploadingState(file, fileIndex);

        return this._controller.initiateUpload(state)
            .then(() => this._uploadChunks(state, progressInfo))
            .then(() => this._finalizeUpload(state),
                reason => {
                    if(reason && reason.canceled) {
                        return this._abortUpload(state);
                    } else {
                        return new Deferred().reject(reason).promise();
                    }
                });
    }

    _uploadChunks(state, progressInfo) {
        if(this._canceled || this._cancellationState[state.fileIndex]) {
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
                this._raiseOnProgress(progressInfo, state);
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

    _raiseOnProgress(progressInfo, state) {
        const commonValue = progressInfo.totalBytesCount !== 0 ? progressInfo.uploadedBytesCount / progressInfo.totalBytesCount : 1;
        const fileValue = state.file.size !== 0 ? state.uploadedBytesCount / state.file.size : 1;
        const args = {
            fileIndex: state.fileIndex,
            commonValue,
            fileValue
        };
        this._onProgressHandler(args);
    }

    _createUploadingState(file, fileIndex) {
        const chunkCount = Math.ceil(file.size / this._controller.chunkSize);

        return {
            file,
            fileIndex,
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

module.exports = FileManagerFileUploader;
