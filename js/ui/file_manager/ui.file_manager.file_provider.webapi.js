import ajax from "../../core/utils/ajax";
import { noop } from "../../core/utils/common";
import Guid from "../../core/guid";
import windowUtils from "../../core/utils/window";

import FileManagerItem from "./ui.file_manager.items";
import FileProvider from "./ui.file_manager.file_provider";

const window = windowUtils.getWindow();
const FILE_CHUNK_BLOB_NAME = "chunk";
const FILE_CHUNK_META_DATA_NAME = "chunkMetadata";

var WebAPIFileProvider = FileProvider.inherit({

    ctor: function(options) {
        this._options = options;
    },

    getFolders: function(path) {
        return this._getItems(path, true);
    },

    getFiles: function(path) {
        return this._getItems(path, false);
    },

    renameItem: function(item, name) {
        return this._executeRequest(this._options.renameUrl, {
            id: item.relativeName,
            newName: name
        });
    },

    createFolder: function(parentFolder, name) {
        return this._executeRequest(this._options.createFolderUrl, {
            parentId: parentFolder.relativeName,
            name: name
        });
    },

    deleteItems: function(items) {
        return items.map(item => this._executeRequest(this._options.deleteUrl, { id: item.relativeName }));
    },

    moveItems: function(items, destinationFolder) {
        return items.map(item => this._executeRequest(this._options.moveUrl, {
            sourceId: item.relativeName,
            destinationId: destinationFolder.relativeName
        }));
    },

    copyItems: function(items, destinationFolder) {
        return items.map(item => this._executeRequest(this._options.copyUrl, {
            sourceId: item.relativeName,
            destinationId: destinationFolder.relativeName
        }));
    },

    initiateFileUpload: function(uploadInfo) {
        uploadInfo.customData.uploadId = new Guid();
    },

    uploadFileChunk: function(uploadInfo, chunk) {
        var params = {
            destinationId: uploadInfo.destinationFolder.relativeName
        };
        var url = this._options.uploadChunkUrl + "?" + this._getQueryString(params);

        var formData = new window.FormData();
        formData.append(FILE_CHUNK_BLOB_NAME, chunk.blob);
        formData.append(FILE_CHUNK_META_DATA_NAME, JSON.stringify({
            UploadId: uploadInfo.customData.uploadId,
            FileName: uploadInfo.file.name,
            Index: chunk.index,
            TotalCount: uploadInfo.totalChunkCount,
            FileSize: uploadInfo.file.size
        }));

        return ajax.sendRequest({
            url: url,
            method: "POST",
            dataType: "text",
            data: formData,
            upload: {
                onprogress: noop,
                onloadstart: noop,
                onabort: noop
            },
            cache: false
        });
    },

    abortFileUpload: function(uploadInfo) {
        return this._executeRequest(this._options.abortUploadUrl, { uploadId: uploadInfo.customData.uploadId });
    },

    _getItems: function(path, isFolder) {
        var that = this;
        return this._getEntriesByPath(path)
            .then(entries => { return that._convertEntriesToItems(entries, path, isFolder); });
    },

    _getItemsIds: function(items) {
        return items.map(it => { return it.relativeName; });
    },

    _getEntriesByPath: function(path) {
        return this._executeRequest(this._options.loadUrl, { parentId: path }, true);
    },

    _executeRequest: function(url, params, jsonResult) {
        var queryString = this._getQueryString(params);
        var finalUrl = url + "?" + queryString;
        var dataType = jsonResult ? "json" : "text";
        return ajax.sendRequest({
            url: finalUrl,
            dataType: dataType,
            cache: false
        });
    },

    _getQueryString: function(params) {
        var pairs = [];

        var keys = Object.keys(params);
        for(var key, i = 0; key = keys[i]; i++) {
            var value = params[key];

            if(value === undefined) continue;

            if(value === null) value = "";

            if(Array.isArray(value)) {
                this._processQueryStringArrayParam(key, value, pairs);
            } else {
                var pair = this._getQueryStringPair(key, value);
                pairs.push(pair);
            }
        }

        return pairs.join("&");
    },

    _processQueryStringArrayParam: function(key, array, pairs) {
        for(var item, i = 0; item = array[i]; i++) {
            var pair = this._getQueryStringPair(key, item);
            pairs.push(pair);
        }
    },

    _getQueryStringPair: function(key, value) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    },

    _convertEntriesToItems: function(entries, path, isFolder) {
        var result = [];
        for(var entry, i = 0; entry = entries[i]; i++) {
            if(entry.isFolder === isFolder) {
                var item = new FileManagerItem(path, entry.name);
                item.length = entry.size || 0;
                item.lastWriteTime = entry.lastWriteTime;
                result.push(item);
            }
        }
        return result;
    }

});

module.exports = WebAPIFileProvider;
