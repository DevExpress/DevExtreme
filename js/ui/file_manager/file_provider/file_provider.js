import { compileGetter } from "../../../core/utils/data";
import { pathCombine, getFileExtension, getParentPath, getName } from "../ui.file_manager.utils";
import { deserializeDate } from "../../../core/utils/date_serialization";
import { each } from "../../../core/utils/iterator";

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
        this._nameGetter = compileGetter(this._getNameExpr(options));
        this._isFolderGetter = compileGetter(this._getIsFolderExpr(options));
        this._sizeGetter = compileGetter(options.sizeExpr || "size");
        this._dateModifiedGetter = compileGetter(options.dateModifiedExpr || "dateModified");
        this._thumbnailGetter = compileGetter(options.thumbnailExpr || "thumbnail");
    }

    getFolders(path) {
        return this.getItems(path, "folder");
    }

    getFiles(path) {
        return this.getItems(path, "file");
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
        return this.getItems(path).filter(item => item.isFolder === folders);
    }

    _convertDataObjectsToFileItems(entries, path, itemType) {
        const useFolders = itemType === "folder";
        const result = [];
        each(entries, (_, entry) => {
            const fileItem = this._createFileItem(entry, path);
            if(!itemType || fileItem.isFolder === useFolders) {
                result.push(fileItem);
            }
        });
        return result;
    }
    _createFileItem(dataObj, path) {
        let fileItem = new FileManagerItem(path, this._nameGetter(dataObj), !!this._isFolderGetter(dataObj));

        fileItem.size = this._sizeGetter(dataObj);
        if(fileItem.size === undefined) {
            fileItem.size = 0;
        }

        fileItem.dateModified = deserializeDate(this._dateModifiedGetter(dataObj));
        if(fileItem.dateModified === undefined) {
            fileItem.dateModified = new Date();
        }

        if(fileItem.isFolder) {
            fileItem.hasSubDirs = this._hasSubDirs(dataObj);
        }

        fileItem.thumbnail = this._thumbnailGetter(dataObj) || "";
        fileItem.dataItem = dataObj;
        return fileItem;
    }

    _hasSubDirs(dataObj) {
        return true;
    }

    _getNameExpr(options) {
        return options.nameExpr || "name";
    }

    _getIsFolderExpr(options) {
        return options.isFolderExpr || "isFolder";
    }

}

class FileManagerItem {
    constructor(parentPath, name, isFolder) {
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = pathCombine(this.parentPath, name);
        this.isFolder = isFolder || false;

        this.size = 0;
        this.dateModified = new Date();

        this.thumbnail = "";
        this.tooltipText = "";
    }

    getExtension() {
        return this.isFolder ? "" : getFileExtension(this.name);
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
        const result = new FileManagerItem(this.parentPath, this.name, this.isFolder);
        result.size = this.size;
        result.dateModified = this.dateModified;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        return result;
    }
}

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
