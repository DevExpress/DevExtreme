import { compileGetter } from '../../../core/utils/data';
import { pathCombine, getFileExtension, getParentPath, getName } from '../ui.file_manager.utils';
import { ensureDefined } from '../../../core/utils/common';
import { deserializeDate } from '../../../core/utils/date_serialization';
import { each } from '../../../core/utils/iterator';

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

/**
* @name FileProvider
* @type object
* @module ui/file_manager/file_provider/file_provider
* @export default
* @hidden
*/
class FileProvider {

    constructor(options) {
        options = ensureDefined(options, {});

        /**
         * @name FileProviderOptions.nameExpr
         * @type string|function(fileItem)
         */
        this._nameGetter = compileGetter(this._getNameExpr(options));
        /**
         * @name FileProviderOptions.isDirectoryExpr
         * @type string|function(fileItem)
         */
        this._isDirGetter = compileGetter(this._getIsDirExpr(options));
        /**
         * @name FileProviderOptions.sizeExpr
         * @type string|function(fileItem)
         */
        this._sizeGetter = compileGetter(options.sizeExpr || 'size');
        /**
         * @name FileProviderOptions.dateModifiedExpr
         * @type string|function(fileItem)
         */
        this._dateModifiedGetter = compileGetter(options.dateModifiedExpr || 'dateModified');
        /**
         * @name FileProviderOptions.thumbnailExpr
         * @type string|function(fileItem)
         */
        this._thumbnailGetter = compileGetter(options.thumbnailExpr || 'thumbnail');
    }

    getFolders(path) {
        return this.getItems(path, 'folder');
    }

    getFiles(path) {
        return this.getItems(path, 'file');
    }

    getItems(path, itemType) {
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

    initiateFileUpload(uploadInfo) {
    }

    uploadFileChunk(uploadInfo, chunk) {
    }

    finalizeFileUpload(uploadInfo) {
    }

    abortFileUpload(uploadInfo) {
    }

    getFileUploadChunkSize() {
        return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
    }

    _getItemsByType(path, folders) {
        return this.getItems(path).filter(item => item.isDirectory === folders);
    }

    _convertDataObjectsToFileItems(entries, path, itemType) {
        const useFolders = itemType === 'folder';
        const result = [];
        each(entries, (_, entry) => {
            const fileItem = this._createFileItem(entry, path);
            if(!itemType || fileItem.isDirectory === useFolders) {
                result.push(fileItem);
            }
        });
        return result;
    }
    _createFileItem(dataObj, path) {
        let fileItem = new FileManagerItem(path, this._nameGetter(dataObj), !!this._isDirGetter(dataObj));

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

        fileItem.thumbnail = this._thumbnailGetter(dataObj) || '';
        fileItem.dataItem = dataObj;
        return fileItem;
    }

    _hasSubDirs(dataObj) {
        return true;
    }

    _getNameExpr(options) {
        return options.nameExpr || 'name';
    }

    _getIsDirExpr(options) {
        return options.isDirectoryExpr || 'isDirectory';
    }

}

class FileManagerItem {
    constructor(parentPath, name, isDirectory) {
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = pathCombine(this.parentPath, name);
        this.isDirectory = isDirectory || false;

        this.size = 0;
        this.dateModified = new Date();

        this.thumbnail = '';
        this.tooltipText = '';
    }

    getExtension() {
        return this.isDirectory ? '' : getFileExtension(this.name);
    }

    getParent() {
        if(this.isRoot()) {
            return null;
        }

        return new FileManagerItem(getParentPath(this.parentPath), getName(this.parentPath), true);
    }

    isRoot() {
        return !this.relativeName;
    }

    equals(item) {
        return item && this.relativeName === item.relativeName;
    }

    createClone() {
        const result = new FileManagerItem(this.parentPath, this.name, this.isDirectory);
        result.size = this.size;
        result.dateModified = this.dateModified;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        result.hasSubDirs = this.hasSubDirs;
        result.dataItem = this.dataItem;
        return result;
    }
}

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
