const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

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
        this.relativeName = this.parentPath ? this.parentPath + "/" + this.name : this.name;
        this.isFolder = isFolder || false;

        this.length = 0;
        this.lastWriteTime = new Date();

        this.thumbnail = "";
        this.tooltipText = "";
    }

    getExtension() {
        if(this.isFolder) {
            return "";
        }

        const index = this.name.lastIndexOf(".");
        return index !== -1 ? this.name.substr(index) : "";
    }
}

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
