import { compileGetter } from '../core/utils/data';
import { ensureDefined } from '../core/utils/common';
import { deserializeDate } from '../core/utils/date_serialization';
import { each } from '../core/utils/iterator';
import { isPromise } from '../core/utils/type';
import { Deferred, fromPromise } from '../core/utils/deferred';
import FileSystemItem from './file_system_item';

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

class FileSystemProviderBase {

    constructor(options) {
        options = ensureDefined(options, {});

        this._keyGetter = compileGetter(this._getKeyExpr(options));
        this._nameGetter = compileGetter(this._getNameExpr(options));
        this._isDirGetter = compileGetter(this._getIsDirExpr(options));
        this._sizeGetter = compileGetter(this._getSizeExpr(options));
        this._dateModifiedGetter = compileGetter(this._getDateModifiedExpr(options));
        this._thumbnailGetter = compileGetter(options.thumbnailExpr || 'thumbnail');
    }

    getItems(parentDirectory) {
        return [];
    }

    renameItem(item, name) {
    }

    createDirectory(parentDirectory, name) {
    }

    deleteItems(items) {
    }

    moveItems(items, destinationDirectory) {
    }

    copyItems(items, destinationDirectory) {
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
    }

    downloadItems(items) {
    }

    getItemsContent(items) {
    }

    getFileUploadChunkSize() {
        return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
    }

    _convertDataObjectsToFileItems(entries, pathInfo) {
        const result = [];
        each(entries, (_, entry) => {
            const fileItem = this._createFileItem(entry, pathInfo);
            result.push(fileItem);
        });
        return result;
    }
    _createFileItem(dataObj, pathInfo) {
        const fileItem = new FileSystemItem(pathInfo, this._nameGetter(dataObj), !!this._isDirGetter(dataObj));

        fileItem.size = this._sizeGetter(dataObj);
        if(fileItem.size === undefined) {
            fileItem.size = 0;
        }

        fileItem.dateModified = deserializeDate(this._dateModifiedGetter(dataObj));
        if(fileItem.dateModified === undefined) {
            fileItem.dateModified = new Date();
        }

        if(fileItem.isDirectory) {
            fileItem.hasSubDirectories = this._hasSubDirs(dataObj);
        }

        fileItem.key = this._keyGetter(dataObj);
        if(!fileItem.key) {
            fileItem.key = fileItem.relativeName;
        }

        fileItem.thumbnail = this._thumbnailGetter(dataObj) || '';
        fileItem.dataItem = dataObj;
        return fileItem;
    }

    _hasSubDirs(dataObj) {
        return true;
    }

    _getKeyExpr(options) {
        return options.keyExpr || this._defaultKeyExpr;
    }

    _defaultKeyExpr(fileItem) {
        if(arguments.length === 2) {
            fileItem.__KEY__ = arguments[1];
            return;
        }
        return Object.prototype.hasOwnProperty.call(fileItem, '__KEY__') ? fileItem.__KEY__ : null;
    }

    _getNameExpr(options) {
        return options.nameExpr || 'name';
    }

    _getIsDirExpr(options) {
        return options.isDirectoryExpr || 'isDirectory';
    }

    _getSizeExpr(options) {
        return options.sizeExpr || 'size';
    }

    _getDateModifiedExpr(options) {
        return options.dateModifiedExpr || 'dateModified';
    }

    _executeActionAsDeferred(action, keepResult) {
        const deferred = new Deferred();

        try {
            const result = action();

            if(isPromise(result)) {
                fromPromise(result)
                    .done(userResult => deferred.resolve(keepResult && userResult || undefined))
                    .fail(error => deferred.reject(error));
            } else {
                deferred.resolve(keepResult && result || undefined);
            }

        } catch(error) {
            return deferred.reject(error);
        }

        return deferred.promise();
    }
}

module.exports = FileSystemProviderBase;
