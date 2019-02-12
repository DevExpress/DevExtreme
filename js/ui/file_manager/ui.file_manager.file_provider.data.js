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

    deleteItems: function(items) {
        for(var item, i = 0; item = items[i]; i++) {
            this._deleteItem(item);
        }
    },

    _deleteItem: function(item) {
        var array = this._data;
        if(item.parentPath !== "") {
            var entry = this._findItem(item.parentPath);
            array = entry.children;
        }
        var index = array.indexOf(item.dataItem);
        array.splice(index, 1);
    },

    _getItems: function(path, isFolder) {
        if(path === "") {
            return this._getItemsInternal(path, this._data, isFolder);
        }

        var folderEntry = this._findItem(path);
        var entries = folderEntry && folderEntry.children || [];
        return this._getItemsInternal(path, entries, isFolder);
    },

    _findItem: function(path) {
        if(path === "") return null;

        var result = null;
        var data = this._data;
        var parts = path.split("/");
        for(var part, i = 0; part = parts[i]; i++) {
            result = data.filter(entry => { return entry.isFolder && entry.name === part; })[0];
            if(result && result.children) {
                data = result.children;
            } else {
                return null;
            }
        }

        return result;
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
