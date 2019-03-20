import Class from "../core/class";

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

var FileProvider = Class.inherit({

    getFolders: function(path) {
        return this.getItems(path, "folder");
    },

    getFiles: function(path) {
        return this.getItems(path, "file");
    },

    getItems: function(path, itemType) {
        return [];
    },

    renameItem: function(item, name) {
    },

    createFolder: function(parentFolder, name) {
    },

    deleteItems: function(items) {
    },

    moveItems: function(items, destinationFolder) {
    },

    copyItems: function(items, destinationFolder) {
    },

    initiateFileUpload: function(uploadInfo) {

    },

    uploadFileChunk: function(uploadInfo, chunk) {

    },

    finalizeFileUpload: function(uploadInfo) {

    },

    abortFileUpload: function(uploadInfo) {

    },

    getFileUploadChunkSize: function() {
        return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
    },

    _getItemsByType: function(path, folders) {
        return this.getItems(path).filter(item => item.isFolder === folders);
    }

});

var FileManagerItem = Class.inherit({
    ctor: function(parentPath, name, isFolder) {
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = this.parentPath ? this.parentPath + "/" + this.name : this.name;
        this.isFolder = isFolder || false;

        this.length = 0;
        this.lastWriteTime = new Date();

        this.thumbnail = "";
        this.tooltipText = "";
    },

    getExtension: function() {
        if(this.isFolder) return "";

        var index = this.name.lastIndexOf(".");
        return index !== -1 ? this.name.substr(index) : "";
    }
});

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
