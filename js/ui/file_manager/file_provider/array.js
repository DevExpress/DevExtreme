import { ensureDefined } from "../../../core/utils/common";
import { compileGetter, compileSetter } from "../../../core/utils/data";
import Guid from "../../../core/guid";
import { each } from "../../../core/utils/iterator";
import typeUtils from "../../../core/utils/type";
import { errors } from "../../../data/errors";

import { FileProvider } from "./file_provider";
import { ErrorCode } from "../ui.file_manager.common";
import { pathCombine } from "../ui.file_manager.utils";

/**
* @name ArrayFileProvider
* @inherits FileProvider
* @type object
* @module ui/file_manager/file_provider/array
* @export default
*/
class ArrayFileProvider extends FileProvider {

    constructor(options) {
        options = ensureDefined(options, { });
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
         * @name ArrayFileProviderOptions.itemsExpr
         * @type string|function(fileItem)
         */
        const itemsExpr = options.itemsExpr || "items";
        this._subFileItemsGetter = compileGetter(itemsExpr);
        this._subFileItemsSetter = this._getSetter(itemsExpr);

        const nameExpr = this._getNameExpr(options);
        this._nameSetter = this._getSetter(nameExpr);

        const isDirExpr = this._getIsDirExpr(options);
        this._getIsDirSetter = this._getSetter(isDirExpr);

        const keyExpr = this._getKeyExpr(options);
        this._keySetter = this._getSetter(keyExpr);

        this._data = initialArray || [ ];
    }

    getItems(path) {
        return this._getItems(path);
    }

    renameItem(item, name) {
        if(!item) {
            return;
        }
        this._nameSetter(item.dataItem, name);
        item.name = name;

        let key = this._keyGetter(item.dataItem);
        if(!key) {
            key = String(new Guid());
            this._keySetter(item.dataItem, key);
            item.key = key;
        }
    }

    createFolder(parentDir, name) {
        let newDir = { };
        this._nameSetter(newDir, name);
        this._getIsDirSetter(newDir, true);

        this._keySetter(newDir, String(new Guid()));

        const array = this._getDirectoryDataItems(parentDir);
        array.push(newDir);

        if(parentDir && !parentDir.isRoot) {
            parentDir.hasSubDirs = this._hasSubDirs(parentDir.dataItem);
        }
    }

    deleteItems(items) {
        each(items, (_, item) => this._deleteItem(item));
    }

    moveItems(items, destinationDir) {
        let array = this._getDirectoryDataItems(destinationDir);
        each(items, (_, item) => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);
            this._deleteItem(item);
            array.push(item.dataItem);
        });
    }

    copyItems(items, destinationDir) {
        const array = this._getDirectoryDataItems(destinationDir);
        each(items, (_, item) => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);

            const copiedItem = this._createCopy(item.dataItem);
            array.push(copiedItem);
        });
        destinationDir.hasSubDirs = this._hasSubDirs(destinationDir.dataItem);
    }

    _checkAbilityToMoveOrCopyItem(item, destinationDir) {
        const newItemPath = pathCombine(destinationDir.relativeName, item.name);
        if(newItemPath.indexOf(item.relativeName) === 0) {
            throw {
                errorId: ErrorCode.Other,
                fileItem: item
            };
        }
    }

    _createCopy(dataObj) {
        let copyObj = { };
        this._nameSetter(copyObj, this._nameGetter(dataObj));
        this._getIsDirSetter(copyObj, this._isDirGetter(dataObj));

        const items = this._subFileItemsGetter(dataObj);
        if(Array.isArray(items)) {
            let itemsCopy = [];
            each(items, (_, childItem) => {
                const childCopy = this._createCopy(childItem);
                itemsCopy.push(childCopy);
            });
            this._subFileItemsSetter(copyObj, itemsCopy);
        }
        return copyObj;
    }

    _deleteItem({ parentPath, dataItem }) {
        let array = this._data;
        if(parentPath !== "") {
            const folder = this._findItem(parentPath);
            array = this._subFileItemsGetter(folder);
        }
        const index = array.indexOf(dataItem);
        array.splice(index, 1);
    }

    _getDirectoryDataItems(directory) {
        if(!directory || !directory.dataItem) {
            return this._data;
        }

        let dataItems = this._subFileItemsGetter(directory.dataItem);
        if(!Array.isArray(dataItems)) {
            dataItems = [];
            this._subFileItemsSetter(directory.dataItem, dataItems);
        }
        return dataItems;
    }

    _getItems(parentDirKey) {
        let dirFileObjects = this._data;
        if(parentDirKey) {
            const folderEntry = this._findItem(parentDirKey);
            dirFileObjects = folderEntry && this._subFileItemsGetter(folderEntry) || [];
        }
        return this._convertDataObjectsToFileItems(dirFileObjects, parentDirKey || "");
    }

    _findItem(key) {
        return this._findItemRecursive(key, this._data, "");
    }

    _findItemRecursive(key, fileItemObjects, currentPath) {
        if(!key || !Array.isArray(fileItemObjects)) {
            return null;
        }

        let foundDataObj = null;
        for(let i = 0; i < fileItemObjects.length && !foundDataObj; i++) {
            const dataObj = fileItemObjects[i];
            foundDataObj = this._getKeyByDataObject(dataObj, currentPath) === key && dataObj || null;
            if(!foundDataObj && this._isDirGetter(dataObj)) {
                const dirPath = pathCombine(currentPath, this._nameGetter(dataObj));
                foundDataObj = this._findItemRecursive(key, this._subFileItemsGetter(dataObj), dirPath);
            }
        }
        return foundDataObj;
    }

    _getKeyByDataObject(dataObj, currentPath) {
        let key = this._keyGetter(dataObj);
        if(!key) {
            key = pathCombine(currentPath, this._nameGetter(dataObj));
        }
        return key;
    }

    _hasSubDirs(dataObj) {
        const subItems = ensureDefined(this._subFileItemsGetter(dataObj), []);

        if(!Array.isArray(subItems)) {
            return true;
        }

        for(let i = 0; i < subItems.length; i++) {
            if(this._isDirGetter(subItems[i]) === true) {
                return true;
            }
        }
        return false;
    }

    _getSetter(expr) {
        return typeUtils.isFunction(expr) ? expr : compileSetter(expr);
    }

}

module.exports = ArrayFileProvider;
