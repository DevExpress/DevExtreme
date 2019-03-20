import ajax from "../core/utils/ajax";
import { Deferred } from "../core/utils/deferred";
import { FileProvider } from "./file_provider";
import ArrayFileProvider from "./file_provider.array";

var AjaxFileProvider = FileProvider.inherit({

    ctor: function(options) {
        this._url = options.url;
        this._provider = null;
    },

    getItems: function(path, itemType) {
        return this._doActionAfterDataAcquired(() => this._provider.getItems(path, itemType));
    },

    renameItem: function(item, name) {
        return this._doActionAfterDataAcquired(() => this._provider.renameItem(item, name));
    },

    createFolder: function(parentFolder, name) {
        return this._doActionAfterDataAcquired(() => this._provider.createFolder(parentFolder, name));
    },

    deleteItems: function(items) {
        return this._doActionAfterDataAcquired(() => this._provider.deleteItems(items));
    },

    moveItems: function(items, destinationFolder) {
        return this._doActionAfterDataAcquired(() => this._provider.moveItems(items, destinationFolder));
    },

    copyItems: function(items, destinationFolder) {
        return this._doActionAfterDataAcquired(() => this._provider.copyItems(items, destinationFolder));
    },

    initiateFileUpload: function(uploadInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.initiateFileUpload(uploadInfo));
    },

    uploadFileChunk: function(uploadInfo, chunk) {
        return this._doActionAfterDataAcquired(() => this._provider.uploadFileChunk(uploadInfo, chunk));
    },

    finalizeFileUpload: function(uploadInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.finalizeFileUpload(uploadInfo));
    },

    abortFileUpload: function(uploadInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.abortFileUpload(uploadInfo));
    },

    _doActionAfterDataAcquired: function(action) {
        return this._ensureDataAcquired().then(action.bind(this));
    },

    _ensureDataAcquired: function() {
        if(this._provider) {
            return new Deferred().resolve().promise();
        }

        return this._getData()
            .done(data => { this._provider = new ArrayFileProvider(data); });
    },

    _getData: function() {
        return ajax.sendRequest({
            url: this._url,
            dataType: "json",
            cache: false
        });
    }

});

module.exports = AjaxFileProvider;
