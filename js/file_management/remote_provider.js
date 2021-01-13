import $ from '../core/renderer';
import ajax from '../core/utils/ajax';
import { ensureDefined, noop } from '../core/utils/common';
import Guid from '../core/guid';
import { getWindow } from '../core/utils/window';
import { each } from '../core/utils/iterator';
import { Deferred } from '../core/utils/deferred';
import eventsEngine from '../events/core/events_engine';

import FileSystemProviderBase from './provider_base';
import { compileGetter } from '../core/utils/data';
import { isFunction } from '../core/utils/type';

const window = getWindow();
const FILE_CHUNK_BLOB_NAME = 'chunk';
const FILE_SYSTEM_COMMNAD = {
    GET_DIR_CONTENTS: 'GetDirContents',
    CREATE_DIR: 'CreateDir',
    RENAME: 'Rename',
    MOVE: 'Move',
    COPY: 'Copy',
    REMOVE: 'Remove',
    UPLOAD_CHUNK: 'UploadChunk',
    ABORT_UPLOAD: 'AbortUpload',
    DOWLOAD: 'Download'
};

class RemoteFileSystemProvider extends FileSystemProviderBase {

    constructor(options) {
        options = ensureDefined(options, { });
        super(options);
        this._endpointUrl = options.endpointUrl;
        this._customizeRequest = options.customizeRequest;
        this._requestHeaders = options.requestHeaders;
        this._hasSubDirsGetter = compileGetter(options.hasSubDirectoriesExpr || 'hasSubDirectories');
    }

    getItems(parentDir) {
        const pathInfo = parentDir.getFullPathInfo();
        return this._executeRequest(FILE_SYSTEM_COMMNAD.GET_DIR_CONTENTS, { pathInfo })
            .then(result => this._convertDataObjectsToFileItems(result.result, pathInfo));
    }

    renameItem(item, name) {
        return this._executeRequest(FILE_SYSTEM_COMMNAD.RENAME, {
            pathInfo: item.getFullPathInfo(),
            isDirectory: item.isDirectory,
            name
        });
    }

    createDirectory(parentDir, name) {
        return this._executeRequest(FILE_SYSTEM_COMMNAD.CREATE_DIR, {
            pathInfo: parentDir.getFullPathInfo(),
            name
        }).done(() => {
            if(parentDir && !parentDir.isRoot()) {
                parentDir.hasSubDirectories = true;
            }
        });
    }

    deleteItems(items) {
        return items.map(item => this._executeRequest(FILE_SYSTEM_COMMNAD.REMOVE, {
            pathInfo: item.getFullPathInfo(),
            isDirectory: item.isDirectory
        }));
    }

    moveItems(items, destinationDirectory) {
        return items.map(item => this._executeRequest(FILE_SYSTEM_COMMNAD.MOVE, {
            sourcePathInfo: item.getFullPathInfo(),
            sourceIsDirectory: item.isDirectory,
            destinationPathInfo: destinationDirectory.getFullPathInfo()
        }));
    }

    copyItems(items, destinationFolder) {
        return items.map(item => this._executeRequest(FILE_SYSTEM_COMMNAD.COPY, {
            sourcePathInfo: item.getFullPathInfo(),
            sourceIsDirectory: item.isDirectory,
            destinationPathInfo: destinationFolder.getFullPathInfo()
        }));
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        if(chunksInfo.chunkIndex === 0) {
            chunksInfo.customData.uploadId = new Guid();
        }

        const args = {
            destinationPathInfo: destinationDirectory.getFullPathInfo(),
            chunkMetadata: JSON.stringify({
                UploadId: chunksInfo.customData.uploadId,
                FileName: fileData.name,
                Index: chunksInfo.chunkIndex,
                TotalCount: chunksInfo.chunkCount,
                FileSize: fileData.size
            })
        };

        const formData = new window.FormData();
        formData.append(FILE_CHUNK_BLOB_NAME, chunksInfo.chunkBlob);
        formData.append('arguments', JSON.stringify(args));
        formData.append('command', FILE_SYSTEM_COMMNAD.UPLOAD_CHUNK);

        const deferred = new Deferred();
        ajax.sendRequest({
            url: this._endpointUrl,
            headers: this._requestHeaders || {},
            beforeSend: xhr => this._beforeSend(xhr),
            method: 'POST',
            dataType: 'json',
            data: formData,
            upload: {
                onprogress: noop,
                onloadstart: noop,
                onabort: noop
            },
            cache: false
        })
            .done(result => {
                !result.success && deferred.reject(result) || deferred.resolve();
            })
            .fail(deferred.reject);

        return deferred.promise();
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
        return this._executeRequest(FILE_SYSTEM_COMMNAD.ABORT_UPLOAD, { uploadId: chunksInfo.customData.uploadId });
    }

    downloadItems(items) {
        const args = this._getDownloadArgs(items);

        const $form = $('<form>')
            .css({ display: 'none' })
            .attr({
                method: 'post',
                action: args.url
            });

        ['command', 'arguments'].forEach(name => {
            $('<input>').attr({
                type: 'hidden',
                name,
                value: args[name]
            }).appendTo($form);
        });

        $form.appendTo('body');

        eventsEngine.trigger($form, 'submit');

        setTimeout(() => $form.remove());
    }

    getItemsContent(items) {
        const args = this._getDownloadArgs(items);

        const formData = new window.FormData();
        formData.append('command', args.command);
        formData.append('arguments', args.arguments);

        return ajax.sendRequest({
            url: args.url,
            headers: this._requestHeaders || {},
            beforeSend: xhr => this._beforeSend(xhr),
            method: 'POST',
            responseType: 'arraybuffer',
            data: formData,
            upload: {
                onprogress: noop,
                onloadstart: noop,
                onabort: noop
            },
            cache: false
        });
    }

    _getDownloadArgs(items) {
        const pathInfoList = items.map(item => item.getFullPathInfo());
        const args = { pathInfoList };
        const argsStr = JSON.stringify(args);
        return {
            url: this._endpointUrl,
            arguments: argsStr,
            command: FILE_SYSTEM_COMMNAD.DOWLOAD
        };
    }

    _getItemsIds(items) {
        return items.map(it => it.relativeName);
    }

    _executeRequest(command, args) {
        const method = command === FILE_SYSTEM_COMMNAD.GET_DIR_CONTENTS ? 'GET' : 'POST';

        const deferred = new Deferred();
        ajax.sendRequest({
            url: this._getEndpointUrl(command, args),
            headers: this._requestHeaders || {},
            beforeSend: xhr => this._beforeSend(xhr),
            method,
            dataType: 'json',
            cache: false
        }).then(result => {
            !result.success && deferred.reject(result) || deferred.resolve(result);
        },
        e => deferred.reject(e));
        return deferred.promise();
    }

    _beforeSend(xhr) {
        if(isFunction(this._customizeRequest)) {
            this._customizeRequest({ request: xhr });
        }
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

    _getKeyExpr(options) {
        return options.keyExpr || 'key';
    }

}

export default RemoteFileSystemProvider;
