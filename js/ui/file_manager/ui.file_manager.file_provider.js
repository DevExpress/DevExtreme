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

    createFolder: function(folder, name) {
    }

});

module.exports = FileProvider;
