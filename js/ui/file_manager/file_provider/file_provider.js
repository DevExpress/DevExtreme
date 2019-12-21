import { compileGetter } from '../../../core/utils/data';
import { pathCombine, getFileExtension, PATH_SEPARATOR } from '../ui.file_manager.utils';
import { ensureDefined } from '../../../core/utils/common';
import { deserializeDate } from '../../../core/utils/date_serialization';
import { each } from '../../../core/utils/iterator';

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

class FileProvider {

    constructor(options) {
        options = ensureDefined(options, {});

        this._keyGetter = compileGetter(this._getKeyExpr(options));
        this._nameGetter = compileGetter(this._getNameExpr(options));
        this._isDirGetter = compileGetter(this._getIsDirExpr(options));
        this._sizeGetter = compileGetter(options.sizeExpr || 'size');
        this._dateModifiedGetter = compileGetter(options.dateModifiedExpr || 'dateModified');
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
        let fileItem = new FileManagerItem(pathInfo, this._nameGetter(dataObj), !!this._isDirGetter(dataObj));

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

}

class FileManagerItem {
    constructor(pathInfo, name, isDirectory) {
        this.name = name;

        this.pathInfo = pathInfo && [...pathInfo] || [];
        this.parentPath = this._getPathByPathInfo(this.pathInfo);
        this.key = this.relativeName = pathCombine(this.parentPath, name);

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
