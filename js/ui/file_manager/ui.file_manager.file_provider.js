import Class from "../../core/class";

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

    getUploadUrl: function(destinationFolder) {
        return null;
    }

});

module.exports = FileProvider;
