import { each } from "../core/utils/iterator";

import { FileProvider, FileManagerItem } from "./file_provider";

class ArrayFileProvider extends FileProvider {

    constructor(data) {
        super();
        this._data = data || [];
    }

    getItems(path, itemType) {
        return this._getItems(path, itemType);
    }

    renameItem(item, name) {
        item.dataItem.name = name;
    }

    createFolder(parentFolder, name) {
        const newItem = {
            name: name,
            isFolder: true
        };
        const array = this._getChildrenArray(parentFolder.dataItem);
        array.push(newItem);
    }

    deleteItems(items) {
        each(items, (_, item) => this._deleteItem(item));
    }

    moveItems(items, destinationFolder) {
        const array = this._getChildrenArray(destinationFolder.dataItem);
        each(items, (_, item) => {
            this._deleteItem(item);
            array.push(item.dataItem);
        });
    }

    copyItems(items, destinationFolder) {
        const array = this._getChildrenArray(destinationFolder.dataItem);
        each(items, (_, item) => {
            const copiedItem = this._createCopy(item.dataItem);
            array.push(copiedItem);
        });
    }

    _createCopy(dataItem) {
        const result = {
            name: dataItem.name,
            isFolder: dataItem.isFolder
        };
        if(dataItem.children) {
            result.children = [];
            each(dataItem.children, (_, childItem) => {
                const childCopy = this._createCopy(childItem);
                result.children.push(childCopy);
            });
        }
        return result;
    }

    _deleteItem(item) {
        let array = this._data;
        if(item.parentPath !== "") {
            const entry = this._findItem(item.parentPath);
            array = entry.children;
        }
        const index = array.indexOf(item.dataItem);
        array.splice(index, 1);
    }

    _getChildrenArray(dataItem) {
        let array = null;
        if(!dataItem) {
            array = this._data;
        } else {
            if(!dataItem.children) {
                dataItem.children = [];
            }
            array = dataItem.children;
        }
        return array;
    }

    _getItems(path, itemType) {
        if(path === "") {
            return this._getItemsInternal(path, this._data, itemType);
        }

        const folderEntry = this._findItem(path);
        const entries = folderEntry && folderEntry.children || [];
        return this._getItemsInternal(path, entries, itemType);
    }

    _findItem(path) {
        if(path === "") {
            return null;
        }

        let result = null;
        let data = this._data;
        const parts = path.split("/");
        for(let i = 0; i < parts.length; i++) {
            const part = parts[i];
            result = data.filter(entry => entry.isFolder && entry.name === part)[0];
            if(result) {
                if(result.children) {
                    data = result.children;
                } else if(i !== parts.length - 1) {
                    return null;
                }
            } else {
                return null;
            }
        }

        return result;
    }

    _getItemsInternal(path, data, itemType) {
        const useFolders = itemType === "folder";
        const result = [];
        each(data, (_, entry) => {
            const isFolder = !!entry.isFolder;
            if(!itemType || isFolder === useFolders) {
                const item = new FileManagerItem(path, entry.name, isFolder);
                item.length = entry.length !== undefined ? entry.length : 0;
                item.lastWriteTime = entry.lastWriteTime !== undefined ? entry.lastWriteTime : new Date();
                item.thumbnail = entry.thumbnail;
                item.dataItem = entry; // TODO remove if do not need
                result.push(item);
            }
        });
        return result;
    }

}

module.exports = ArrayFileProvider;
