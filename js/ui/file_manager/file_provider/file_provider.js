import { compileGetter } from "../../../core/utils/data";
import { pathCombine, getFileExtension } from "../ui.file_manager.utils";
import { ensureDefined } from "../../../core/utils/common";
import { deserializeDate } from "../../../core/utils/date_serialization";
import { each } from "../../../core/utils/iterator";

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

const FILE_MANAGER_ROOT_DIR_KEY = "__DX-FM-ROOT__";

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
         * @name FileProviderOptions.keyExpr
         * @type string|function(fileItem)
         */
        this._keyGetter = compileGetter(this._getKeyExpr(options));
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
        this._sizeGetter = compileGetter(options.sizeExpr || "size");
        /**
         * @name FileProviderOptions.dateModifiedExpr
         * @type string|function(fileItem)
         */
        this._dateModifiedGetter = compileGetter(options.dateModifiedExpr || "dateModified");
        /**
         * @name FileProviderOptions.thumbnailExpr
         * @type string|function(fileItem)
         */
        this._thumbnailGetter = compileGetter(options.thumbnailExpr || "thumbnail");
    }

    getItems(path) {
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
        const result = [];
        each(entries, (_, entry) => {
            const fileItem = this._createFileItem(entry, path);
            result.push(fileItem);
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

        fileItem.key = this._keyGetter(dataObj);
        if(!fileItem.key) {
            fileItem.key = fileItem.relativeName;
        }

        fileItem.thumbnail = this._thumbnailGetter(dataObj) || "";
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
        return Object.prototype.hasOwnProperty.call(fileItem, "__KEY__") ? fileItem.__KEY__ : null;
    }

    _getNameExpr(options) {
        return options.nameExpr || "name";
    }

    _getIsDirExpr(options) {
        return options.isDirectoryExpr || "isDirectory";
    }

}

class FileManagerItem {
    constructor(parentPath, name, isDirectory) {
        this.parentPath = parentPath;
        this.name = name;
        this.key = this.relativeName = pathCombine(this.parentPath, name);
        this.isDirectory = isDirectory || false;
        this.isRoot = false;

        this.size = 0;
        this.dateModified = new Date();

        this.thumbnail = "";
        this.tooltipText = "";
    }

    getExtension() {
        return this.isDirectory ? "" : getFileExtension(this.name);
    }

    equals(item) {
        return item && this.key === item.key;
    }

    createClone() {
        const result = new FileManagerItem(this.parentPath, this.name, this.isDirectory);
        result.key = this.key;
        result.size = this.size;
        result.dateModified = this.dateModified;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        result.hasSubDirs = this.hasSubDirs;
        result.dataItem = this.dataItem;
        return result;
    }
}

class FileManagerRootItem extends FileManagerItem {
    constructor() {
        super("", "Files", true);
        this.key = FILE_MANAGER_ROOT_DIR_KEY;
        this.isRoot = true;
    }
}

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
module.exports.FileManagerRootItem = FileManagerRootItem;
