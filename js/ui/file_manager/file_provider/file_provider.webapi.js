import ajax from "../../../core/utils/ajax";
import { noop } from "../../../core/utils/common";
import Guid from "../../../core/guid";
import { getWindow } from "../../../core/utils/window";
import { each } from "../../../core/utils/iterator";

import { FileProvider, FileManagerItem } from "./file_provider";

const window = getWindow();
const FILE_CHUNK_BLOB_NAME = "chunk";

class WebAPIFileProvider extends FileProvider {

    constructor(options) {
        super();
        this._options = options;
    }

    getItems(path, itemType) {
        return this._getItems(path, itemType);
    }

    renameItem(item, name) {
        return this._executeRequest("Rename", {
            id: item.relativeName,
            name
        });
    }

    createFolder(parentFolder, name) {
        return this._executeRequest("CreateFolder", {
            parentId: parentFolder.relativeName,
            name
        });
    }

    deleteItems(items) {
        return items.map(item => this._executeRequest("Remove", { id: item.relativeName }));
    }

    moveItems(items, destinationFolder) {
        return items.map(item => this._executeRequest("Move", {
            sourceId: item.relativeName,
            destinationId: destinationFolder.relativeName + "/" + item.name
        }));
    }

    copyItems(items, destinationFolder) {
        return items.map(item => this._executeRequest("Copy", {
            sourceId: item.relativeName,
            destinationId: destinationFolder.relativeName
        }));
    }

    initiateFileUpload(uploadInfo) {
        uploadInfo.customData.uploadId = new Guid();
    }

    uploadFileChunk(uploadInfo, chunk) {
        const args = {
            destinationId: uploadInfo.destinationFolder.relativeName,
            chunkMetadata: JSON.stringify({
                UploadId: uploadInfo.customData.uploadId,
                FileName: uploadInfo.file.name,
                Index: chunk.index,
                TotalCount: uploadInfo.totalChunkCount,
                FileSize: uploadInfo.file.size
            })
        };

        const formData = new window.FormData();
        formData.append(FILE_CHUNK_BLOB_NAME, chunk.blob);
        formData.append("arguments", JSON.stringify(args));
        formData.append("command", "UploadChunk");

        return ajax.sendRequest({
            url: this._options.loadUrl,
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
    }

    abortFileUpload(uploadInfo) {
        return this._executeRequest("AbortUpload", { uploadId: uploadInfo.customData.uploadId });
    }

    _getItems(path, itemType) {
        return this._getEntriesByPath(path)
            .then(entries => this._convertEntriesToItems(entries, path, itemType));
    }

    _getItemsIds(items) {
        return items.map(it => it.relativeName);
    }

    _getEntriesByPath(path) {
        return this._executeRequest("GetDirContent", { parentId: path }, true);
    }

    _executeRequest(command, args, jsonResult) {
        const queryString = this._getQueryString({
            command,
            arguments: JSON.stringify(args)
        });
        const finalUrl = this._options.loadUrl + "?" + queryString;
        const dataType = jsonResult ? "json" : "text";
        return ajax.sendRequest({
            url: finalUrl,
            dataType: dataType,
            cache: false
        });
    }

    _getQueryString(params) {
        const pairs = [];

        const keys = Object.keys(params);
        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let value = params[key];

            if(value === undefined) {
                continue;
            }

            if(value === null) {
                value = "";
            }

            if(Array.isArray(value)) {
                this._processQueryStringArrayParam(key, value, pairs);
            } else {
                const pair = this._getQueryStringPair(key, value);
                pairs.push(pair);
            }
        }

        return pairs.join("&");
    }

    _processQueryStringArrayParam(key, array, pairs) {
        each(array, (_, item) => {
            const pair = this._getQueryStringPair(key, item);
            pairs.push(pair);
        });
    }

    _getQueryStringPair(key, value) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }

    _convertEntriesToItems(entries, path, itemType) {
        const useFolders = itemType === "folder";
        const result = [];
        each(entries, (_, entry) => {
            const isFolder = !!entry.isFolder;
            if(!itemType || isFolder === useFolders) {
                const item = new FileManagerItem(path, entry.name, isFolder);
                item.length = entry.size || 0;
                item.lastWriteTime = entry.lastWriteTime;
                result.push(item);
            }
        });
        return result;
    }

}

module.exports = WebAPIFileProvider;
