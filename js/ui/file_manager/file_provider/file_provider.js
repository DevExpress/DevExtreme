import { compileGetter } from '../../../core/utils/data';
import { pathCombine, getFileExtension, getPathParts, getName, PATH_SEPARATOR } from '../ui.file_manager.utils';
import { ensureDefined } from '../../../core/utils/common';
import { deserializeDate } from '../../../core/utils/date_serialization';
import { each } from '../../../core/utils/iterator';
import { isPromise, isString } from '../../../core/utils/type';
import { Deferred } from '../../../core/utils/deferred';

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

class FileProvider {

    constructor(options) {
        options = ensureDefined(options, {});

        this._keyGetter = compileGetter(this._getKeyExpr(options));
        this._nameGetter = compileGetter(this._getNameExpr(options));
        this._isDirGetter = compileGetter(this._getIsDirExpr(options));
        this._sizeGetter = compileGetter(this._getSizeExpr(options));
        this._dateModifiedGetter = compileGetter(this._getDateModifiedExpr(options));
        this._thumbnailGetter = compileGetter(options.thumbnailExpr || 'thumbnail');
    }

    getItems(pathInfo) {
        return [];
    }

    renameItem(item, name) {
    }

    createFolder(parentFolder, name) {
    }

    deleteItems(items) {
    }

    moveItems(items, destinationFolder) {
    }

    copyItems(items, destinationFolder) {
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
    }

    downloadItems(items) {
    }

    getItemContent(items) {
    }

    getFileUploadChunkSize() {
        return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
    }

    _getItemsByType(path, folders) {
        return this.getItems(path).filter(item => item.isDirectory === folders);
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
        const fileItem = new FileManagerItem(pathInfo, this._nameGetter(dataObj), !!this._isDirGetter(dataObj));

        fileItem.size = this._sizeGetter(dataObj);
        if(fileItem.size === undefined) {
            fileItem.size = 0;
        }

        fileItem.dateModified = deserializeDate(this._dateModifiedGetter(dataObj));
        if(fileItem.dateModified === undefined) {
            fileItem.dateModified = new Date();
        }

        if(fileItem.isDirectory) {
            fileItem.hasSubDirs = this._hasSubDirs(dataObj);
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
                result
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

class FileManagerItem {
    constructor() {
        const ctor = isString(arguments[0]) ? this._publicCtor : this._internalCtor;
        ctor.apply(this, arguments);
    }

    _internalCtor(pathInfo, name, isDirectory) {
        this.name = name;

        this.pathInfo = pathInfo && [...pathInfo] || [];
        this.parentPath = this._getPathByPathInfo(this.pathInfo);
        this.key = this.relativeName = pathCombine(this.parentPath, name);

        this.path = pathCombine(this.parentPath, name);
        this.pathKeys = this.pathInfo.map(({ key }) => key);
        this.pathKeys.push(this.key);

        this._initialize(isDirectory);
    }

    _publicCtor(path, isDirectory, pathKeys) {
        this.path = path || '';
        this.pathKeys = pathKeys || [];

        const pathInfo = [];

        const parts = getPathParts(path, true);
        for(let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            const pathInfoPart = {
                key: this.pathKeys[i] || part,
                name: getName(part)
            };
            pathInfo.push(pathInfoPart);
        }

        this.pathInfo = pathInfo;

        this.relativeName = path;
        this.name = getName(path);
        this.key = this.pathKeys.length ? this.pathKeys[this.pathKeys.length - 1] : path;
        this.parentPath = parts.length > 1 ? parts[parts.length - 2] : '';

        this._initialize(isDirectory);
    }

    _initialize(isDirectory) {
        this.isDirectory = isDirectory || false;
        this.isRoot = false;

        this.size = 0;
        this.dateModified = new Date();

        this.thumbnail = '';
        this.tooltipText = '';
    }

    getFullPathInfo() {
        const pathInfo = [...this.pathInfo];
        !this.isRoot && pathInfo.push({
            key: this.key,
            name: this.name
        });
        return pathInfo;
    }

    getExtension() {
        return this.isDirectory ? '' : getFileExtension(this.name);
    }

    equals(item) {
        return item && this.key === item.key;
    }

    createClone() {
        const result = new FileManagerItem(this.pathInfo, this.name, this.isDirectory);
        result.key = this.key;
        result.size = this.size;
        result.dateModified = this.dateModified;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        result.hasSubDirs = this.hasSubDirs;
        result.dataItem = this.dataItem;
        return result;
    }

    _getPathByPathInfo(pathInfo) {
        return pathInfo
            .map(info => info.name)
            .join(PATH_SEPARATOR);
    }
}

class FileManagerRootItem extends FileManagerItem {
    constructor() {
        super(null, 'Files', true);
        this.key = '__dxfmroot_394CED1B-58CF-4925-A5F8-042BC0822B31_51558CB8-C170-4655-A9E0-C454ED8EA2C1';
        this.relativeName = '';
        this.isRoot = true;
    }
}

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
module.exports.FileManagerRootItem = FileManagerRootItem;
