import Class from "../../core/class";

var FileProvider = Class.inherit({

    getFolders: function(path) {
        return [];
    },

    getFiles: function(path) {
        return [];
    }

});

module.exports = FileProvider;
