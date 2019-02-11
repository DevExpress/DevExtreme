import ajax from "../../core/utils/ajax";

import FileManagerItem from "./ui.file_manager.items";
import FileProvider from "./ui.file_manager.file_provider";

var WebAPIFileProvider = FileProvider.inherit({

    ctor: function(options) {
        this._options = options;
    },

    getFolders: function(path) {
        return this._getItems(path, true);
    },

    getFiles: function(path) {
        return this._getItems(path, false);
    },

    renameItem: function(item, name) {
    },

    _getItems: function(path, isFolder) {
        var that = this;
        return this._getEntriesByPath(path)
            .then(entries => { return that._convertEntriesToItems(entries, path, isFolder); });
    },

    _getEntriesByPath: function(path) {
        var queryString = "?parentId=" + encodeURIComponent(path);
        var url = this._options.loadUrl + queryString;
        return ajax.sendRequest({
            url: url,
            dataType: "json"
        });
    },

    _convertEntriesToItems: function(entries, path, isFolder) {
        var result = [];
        for(var entry, i = 0; entry = entries[i]; i++) {
            if(entry.isFolder === isFolder) {
                var item = new FileManagerItem(path, entry.name);
                item.length = entry.length || 0;
                item.lastWriteTime = entry.lastWriteTime;
                result.push(item);
            }
        }
        return result;
    }

});

module.exports = WebAPIFileProvider;
