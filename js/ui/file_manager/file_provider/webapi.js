import ajax from '../../../core/utils/ajax';
import { ensureDefined, noop } from '../../../core/utils/common';
import Guid from '../../../core/guid';
import { getWindow } from '../../../core/utils/window';
import { each } from '../../../core/utils/iterator';
import { Deferred } from '../../../core/utils/deferred';

import { FileProvider } from './file_provider';
import { compileGetter } from '../../../core/utils/data';

const window = getWindow();
const FILE_CHUNK_BLOB_NAME = 'chunk';

/**
* @name WebApiFileProvider
* @inherits FileProvider
* @type object
* @module ui/file_manager/file_provider/webapi
* @export default
*/
class WebApiFileProvider extends FileProvider {

    constructor(options) {
        options = ensureDefined(options, { });
        super(options);
        /**
         * @name WebApiFileProviderOptions.endpointUrl
         * @type string
         */
        this._endpointUrl = options.endpointUrl;
        /**
         * @name WebApiFileProviderOptions.hasSubDirectoriesExpr
         * @type string|function(fileItem)
         */
        this._hasSubDirsGetter = compileGetter(options.hasSubDirectoriesExpr || 'hasSubDirectories');
    }

    getItems(path, itemType) {
        return this._getItems(path, itemType);
    }

    renameItem(item, name) {
        return this._executeRequest('Rename', {
            id: item.relativeName,
            name
        });
    }

    createFolder(parentFolder, name) {
        return this._executeRequest('CreateDir', {
            parentId: parentFolder.relativeName,
            name
        });
    }

    deleteItems(items) {
        return items.map(item => this._executeRequest('Remove', { id: item.relativeName }));
    }

    moveItems(items, destinationFolder) {
        return items.map(item => this._executeRequest('Move', {
            sourceId: item.relativeName,
            destinationId: destinationFolder.relativeName + '/' + item.name
        }));
    }

    copyItems(items, destinationFolder) {
        return items.map(item => this._executeRequest('Copy', {
            sourceId: item.relativeName,
            destinationId: destinationFolder.relativeName + '/' + item.name
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
        formData.append('arguments', JSON.stringify(args));
        formData.append('command', 'UploadChunk');

        const deferred = new Deferred();
        ajax.sendRequest({
            url: this._endpointUrl,
            method: 'POST',
            dataType: 'json',
            data: formData,
            upload: {
                onprogress: noop,
                onloadstart: noop,
                onabort: noop
            },
            cache: false
        }).then(result => {
            !result.success && deferred.reject(result) || deferred.resolve();
        },
        e => deferred.reject(e));
        return deferred.promise();
    }

    abortFileUpload(uploadInfo) {
        return this._executeRequest('AbortUpload', { uploadId: uploadInfo.customData.uploadId });
    }

    _getItems(path, itemType) {
        return this._getEntriesByPath(path)
            .then(result => this._convertDataObjectsToFileItems(result.result, path, itemType));
    }

    _getItemsIds(items) {
        return items.map(it => it.relativeName);
    }

    _getEntriesByPath(path) {
        return this._executeRequest('GetDirContents', { parentId: path });
    }

    _executeRequest(command, args) {
        const method = command === 'GetDirContents' ? 'GET' : 'POST';

        const deferred = new Deferred();
        ajax.sendRequest({
            url: this._getEndpointUrl(command, args),
            method,
            dataType: 'json',
            cache: false
        }).then(result => {
            !result.success && deferred.reject(result) || deferred.resolve(result);
        },
        e => deferred.reject(e));
        return deferred.promise();
    }

    _getEndpointUrl(command, args) {
        const queryString = this._getQueryString({
            command,
            arguments: JSON.stringify(args)
        });
        const separator = this._endpointUrl && this._endpointUrl.indexOf('?') > 0 ? '&' : '?';
        return this._endpointUrl + separator + queryString;
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
                value = '';
            }

            if(Array.isArray(value)) {
                this._processQueryStringArrayParam(key, value, pairs);
            } else {
                const pair = this._getQueryStringPair(key, value);
                pairs.push(pair);
            }
        }

        return pairs.join('&');
    }

    _processQueryStringArrayParam(key, array, pairs) {
        each(array, (_, item) => {
            const pair = this._getQueryStringPair(key, item);
            pairs.push(pair);
        });
    }

    _getQueryStringPair(key, value) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }

    _hasSubDirs(dataObj) {
        const hasSubDirs = this._hasSubDirsGetter(dataObj);
        return typeof hasSubDirs === 'boolean' ? hasSubDirs : true;
    }

}

module.exports = WebApiFileProvider;
