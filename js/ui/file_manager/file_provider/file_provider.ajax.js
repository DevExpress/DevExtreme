import ajax from "../../../core/utils/ajax";
import { Deferred } from "../../../core/utils/deferred";
import { FileProvider } from "./file_provider";
import ArrayFileProvider from "./file_provider.array";

class AjaxFileProvider extends FileProvider {

    constructor(options) {
        super();
        this._url = options.url;
        this._provider = null;
    }

    getItems(path, itemType) {
        return this._doActionAfterDataAcquired(() => this._provider.getItems(path, itemType));
    }

    renameItem(item, name) {
        return this._doActionAfterDataAcquired(() => this._provider.renameItem(item, name));
    }

    createFolder(parentFolder, name) {
        return this._doActionAfterDataAcquired(() => this._provider.createFolder(parentFolder, name));
    }

    deleteItems(items) {
        return this._doActionAfterDataAcquired(() => this._provider.deleteItems(items));
    }

    moveItems(items, destinationFolder) {
        return this._doActionAfterDataAcquired(() => this._provider.moveItems(items, destinationFolder));
    }

    copyItems(items, destinationFolder) {
        return this._doActionAfterDataAcquired(() => this._provider.copyItems(items, destinationFolder));
    }

    initiateFileUpload(uploadInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.initiateFileUpload(uploadInfo));
    }

    uploadFileChunk(uploadInfo, chunk) {
        return this._doActionAfterDataAcquired(() => this._provider.uploadFileChunk(uploadInfo, chunk));
    }

    finalizeFileUpload(uploadInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.finalizeFileUpload(uploadInfo));
    }

    abortFileUpload(uploadInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.abortFileUpload(uploadInfo));
    }

    _doActionAfterDataAcquired(action) {
        return this._ensureDataAcquired().then(action.bind(this));
    }

    _ensureDataAcquired() {
        if(this._provider) {
            return new Deferred().resolve().promise();
        }

        return this._getData()
            .done(data => { this._provider = new ArrayFileProvider(data); });
    }

    _getData() {
        return ajax.sendRequest({
            url: this._url,
            dataType: "json",
            cache: false
        });
    }

}

module.exports = AjaxFileProvider;
