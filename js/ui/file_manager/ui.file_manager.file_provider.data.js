import FileManagerItem from "./ui.file_manager.items";
import FileProvider from "./ui.file_manager.file_provider";

var DataFileProvider = FileProvider.inherit({

    ctor: function(data) {
        this._data = data || [];
    },

    getFolders: function(path) {
        return this._getItems(path, true);
    },

    getFiles: function(path) {
        return this._getItems(path, false);
    },

    renameItem: function(item, name) {
        item.dataItem.name = name;
    },

    createFolder: function(parentFolder, name) {
        var parentItem = parentFolder.dataItem;
        var newItem = {
            name: name,
            isFolder: true
        };
        var array = null;
        if(!parentItem) {
            array = this._data;
        } else {
            if(!parentItem.children) parentItem.children = [];
            array = parentItem.children;
        }
        array.push(newItem);
    },

    _getItems: function(path, isFolder) {
        if(path === "") {
            return this._getItemsInternal(path, this._data, isFolder);
        }

        var data = this._data;
        var parts = path.split("/");
        for(var part, i = 0; part = parts[i]; i++) {
            var folderEntry = data.filter(entry => { return entry.isFolder && entry.name === part; })[0];
            if(folderEntry && folderEntry.children) {
                data = folderEntry.children;
            } else {
                return [];
            }
        }

        return this._getItemsInternal(path, data, isFolder);
    },

    _getItemsInternal: function(path, data, isFolder) {
        var result = [];
        for(var entry, i = 0; entry = data[i]; i++) {
            if(entry.isFolder === isFolder) {
                var item = new FileManagerItem(path, entry.name);
                item.length = entry.length !== undefined ? entry.length : 0;
                item.lastWriteTime = entry.lastWriteTime !== undefined ? entry.lastWriteTime : new Date();
                item.dataItem = entry; // TODO remove if do not need
                result.push(item);
            }
        }
        return result;
    }

});

module.exports = DataFileProvider;
