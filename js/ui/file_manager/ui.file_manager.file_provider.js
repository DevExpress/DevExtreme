import Class from "../../core/class";

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

var FileProvider = Class.inherit({

    getFolders: function(path) {
        return [];
    },

    getFiles: function(path) {
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

    getUploadUrl: function(destinationFolder) {
        return null;
    },

    getFileUploadChunkSize: function() {
        return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
    }

});

module.exports = FileProvider;
