import { pathCombine, getFileExtension, getParentPath, getName } from "../ui.file_manager.utils";

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

/**
* @name FileProvider
* @type object
* @module ui/file_manager/file_provider/file_provider
* @export default
*/
class FileProvider {

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

}

class FileManagerItem {
    constructor(parentPath, name, isFolder) {
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = pathCombine(this.parentPath, name);
        this.isFolder = isFolder || false;

        this.length = 0;
        this.lastWriteTime = new Date();

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
        result.length = this.length;
        result.lastWriteTime = this.lastWriteTime;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        return result;
    }
}

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
