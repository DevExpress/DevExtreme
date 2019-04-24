import { ensureDefined } from "../../../core/utils/common";
import { each } from "../../../core/utils/iterator";
import { errors } from "../../../data/errors";

import { FileProvider } from "./file_provider";

/**
* @name ArrayFileProvider
* @inherits FileProvider
* @type object
* @module ui/file_manager/file_provider/array
* @export default
*/
class ArrayFileProvider extends FileProvider {

    constructor(options) {
        super(options);

        const initialArray = options.data;
        if(initialArray && !Array.isArray(initialArray)) {
            throw errors.Error("E4006");
        }

        /**
         * @name ArrayFileProviderOptions.data
         * @type Array<any>
         */
        /**
         * @name ArrayFileProviderOptions.nameExpr
         * @type string|function(fileItem)
         */
        /**
         * @name ArrayFileProviderOptions.isFolderExpr
         * @type string|function(fileItem)
         */
        /**
         * @name ArrayFileProviderOptions.sizeExpr
         * @type string|function(fileItem)
         */
        /**
         * @name ArrayFileProviderOptions.dateModifiedExpr
         * @type string|function(fileItem)
         */
        /**
         * @name ArrayFileProviderOptions.thumbnailExpr
         * @type string|function(fileItem)
         */
        this._data = initialArray || [ ];
    }

    getItems(path, itemType) {
        return this._getItems(path, itemType);
    }

    renameItem(item, name) {
        item.dataItem.name = name;
    }

    createFolder(parentFolder, name) {
        const newItem = {
            name,
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

    _createCopy({ name, children, isFolder }) {
        const result = {
            name,
            isFolder
        };
        if(children) {
            result.children = [];
            each(children, (_, childItem) => {
                const childCopy = this._createCopy(childItem);
                result.children.push(childCopy);
            });
        }
        return result;
    }

    _deleteItem({ parentPath, dataItem }) {
        let array = this._data;
        if(parentPath !== "") {
            const { children } = this._findItem(parentPath);
            array = children;
        }
        const index = array.indexOf(dataItem);
        array.splice(index, 1);
    }

    _getChildrenArray(dataItem) {
        let array = null;
        if(!dataItem) {
            array = this._data;
        } else {
            array = dataItem.children = ensureDefined(dataItem.children, []);
        }
        return array;
    }

    _getItems(path, itemType) {
        if(path === "") {
            return this._convertDataObjectsToFileItems(this._data, path, itemType);
        }

        const folderEntry = this._findItem(path);
        const entries = folderEntry && folderEntry.children || [];
        return this._convertDataObjectsToFileItems(entries, path, itemType);
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

}

module.exports = ArrayFileProvider;
