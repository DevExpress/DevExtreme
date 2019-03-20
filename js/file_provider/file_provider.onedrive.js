import ajax from "../core/utils/ajax";
import { Deferred } from "../core/utils/deferred";
import { noop } from "../core/utils/common";

import { FileProvider, FileManagerItem } from "./file_provider";

const REQUIRED_ITEM_FIELDS = "id,name,folder,lastModifiedDateTime,size,parentReference";
const REST_API_URL = "https://graph.microsoft.com/";
const DRIVE_API_URL = REST_API_URL + "v1.0/drive";
const APP_ROOT_URL = DRIVE_API_URL + "/special/approot";

var OneDriveFileProvider = FileProvider.inherit({

    ctor: function(options) {
        options = options || {};
        this._getAccessTokenUrl = options.getAccessTokenUrl || "";

        this._accessToken = "";
        this._accessTokenPromise = null;
    },

    getItems: function(path, itemType) {
        return this._getItems(path, itemType);
    },

    initiateFileUpload: function(uploadInfo) {
        var folderPath = uploadInfo.destinationFolder.relativeName;
        var fileName = uploadInfo.file.name;
        var customData = uploadInfo.customData;

        return this._ensureAccessTokenAcquired()
            .then(() => { return this._createFile(folderPath, fileName); })
            .then(entry => {
                return this._initiateUploadSession(entry.id)
                    .done(info => { customData.uploadUrl = info.uploadUrl; });
            });
    },

    uploadFileChunk: function(uploadInfo, chunk) {
        return this._uploadFileChunk(uploadInfo.customData.uploadUrl, chunk.blob, chunk.size,
            uploadInfo.uploadedBytesCount, uploadInfo.file.size);
    },

    abortFileUpload: function(uploadInfo) {
        return this._ensureAccessTokenAcquired()
            .then(() => this._cancelUploadSession(uploadInfo.customData.uploadUrl));
    },

    _getItems: function(path, itemType) {
        return this._ensureAccessTokenAcquired()
            .then(() => this._getEntriesByPath(path))
            .then(entries => this._convertEntriesToItems(entries, path, itemType));
    },

    _ensureAccessTokenAcquired: function() {
        if(this._accessTokenPromise) {
            return this._accessTokenPromise;
        }

        var deferred = new Deferred();

        if(this._accessToken) {
            deferred.resolve();
        } else {
            ajax.sendRequest({
                url: this._getAccessTokenUrl,
                dataType: "json"
            }).done(function(response) {
                this._accessToken = response.token;
                this._accessTokenPromise = null;
                deferred.resolve();
            }.bind(this));
        }

        this._accessTokenPromise = deferred.promise();
        return this._accessTokenPromise;
    },

    _getEntriesByPath: function(path) {
        var itemPath = this._prepareItemRelativePath(path);
        var queryString = "?$select=" + REQUIRED_ITEM_FIELDS + "&$expand=children($select=" + REQUIRED_ITEM_FIELDS + ")";
        var url = APP_ROOT_URL + itemPath + queryString;
        return ajax.sendRequest({
            url: url,
            dataType: "json",
            cache: false,
            headers: { "Authorization": "Bearer " + this._accessToken }
        });
    },

    _uploadFileChunk: function(uploadUrl, chunkBlob, chunkSize, uploadedSize, totalSize) {
        var chunkEndPosition = uploadedSize + chunkSize - 1;
        var contentRange = `bytes ${uploadedSize}-${chunkEndPosition}/${totalSize}`;
        return ajax.sendRequest({
            url: uploadUrl,
            method: "PUT",
            dataType: "json",
            data: chunkBlob,
            upload: {
                onprogress: noop,
                onloadstart: noop,
                onabort: noop
            },
            cache: false,
            headers: {
                "Authorization": "Bearer " + this._accessToken,
                "Content-Range": contentRange
            }
        });
    },

    _initiateUploadSession: function(fileId) {
        var url = `${DRIVE_API_URL}/items/${fileId}/createUploadSession`;
        return ajax.sendRequest({
            url: url,
            method: "POST",
            dataType: "json",
            cache: false,
            headers: { "Authorization": "Bearer " + this._accessToken }
        });
    },

    _createFile: function(folderPath, objectName) {
        var itemPath = this._prepareItemRelativePath(folderPath);
        var queryString = "?$select=" + REQUIRED_ITEM_FIELDS;
        var url = APP_ROOT_URL + itemPath + "/children" + queryString;

        var params = {
            "name": objectName,
            "file": { },
            "@microsoft.graph.conflictBehavior": "rename"
        };
        var data = JSON.stringify(params);

        return ajax.sendRequest({
            url: url,
            method: "POST",
            dataType: "json",
            data: data,
            cache: false,
            headers: {
                "Authorization": "Bearer " + this._accessToken,
                "Content-Type": "application/json"
            }
        });
    },

    _cancelUploadSession: function(uploadUrl) {
        return ajax.sendRequest({
            url: uploadUrl,
            method: "DELETE",
            dataType: "json",
            cache: false,
            headers: {
                "Authorization": "Bearer " + this._accessToken
            }
        });
    },

    _convertEntriesToItems: function(entries, path, itemType) {
        var useFolders = itemType === "folder";
        var result = [];
        for(var entry, i = 0; entry = entries.children[i]; i++) {
            var isFolder = entry.hasOwnProperty("folder");
            if(!itemType || isFolder === useFolders) {
                var item = new FileManagerItem(path, entry.name, isFolder);
                item.length = entry.size;
                item.lastWriteTime = entry.lastModifiedDateTime;
                result.push(item);
            }
        }
        return result;
    },

    _prepareItemRelativePath: function(path) {
        return path === "" ? "" : ":/" + path + ":";
    }
});

module.exports = OneDriveFileProvider;
