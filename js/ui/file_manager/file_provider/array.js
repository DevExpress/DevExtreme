import { find } from "../../../core/utils/array";
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
* @namespace DevExpress.fileProvider
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

    getItems(pathInfo) {
        return this._getItems(pathInfo);
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
        if(!this._isFileItemExists(parentDir) || this._isDirGetter(parentDir.fileItem)) {
            throw {
                errorId: ErrorCode.DirectoryNotFound,
                fileItem: parentDir
            };
        }

        let newDir = { };
        this._nameSetter(newDir, name);
        this._getIsDirSetter(newDir, true);

        this._keySetter(newDir, String(new Guid()));

        const array = this._getDirectoryDataItems(parentDir.dataItem);
        array.push(newDir);

        if(parentDir && !parentDir.isRoot) {
            parentDir.hasSubDirs = this._hasSubDirs(parentDir.dataItem);
        }
    }

    deleteItems(items) {
        each(items, (_, item) => this._deleteItem(item));
    }

    moveItems(items, destinationDir) {
        let array = this._getDirectoryDataItems(destinationDir.dataItem);
        each(items, (_, item) => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);
            this._deleteItem(item);
            array.push(item.dataItem);
        });
    }

    copyItems(items, destinationDir) {
        const array = this._getDirectoryDataItems(destinationDir.dataItem);
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

    _deleteItem(fileItem) {
        const fileItemObj = this._findFileItemObj(fileItem.getFullPathInfo());
        if(!fileItemObj) {
            throw {
                errorId: fileItem.isDirectory ? ErrorCode.DirectoryNotFound : ErrorCode.FileNotFound,
                fileItem: fileItem
            };
        }

        const parentDirDataObj = this._findFileItemObj(fileItem.pathInfo);
        let array = this._getDirectoryDataItems(parentDirDataObj);
        const index = array.indexOf(fileItemObj);
        array.splice(index, 1);
    }

    _getDirectoryDataItems(directoryDataObj) {
        if(!directoryDataObj) {
            return this._data;
        }

        let dataItems = this._subFileItemsGetter(directoryDataObj);
        if(!Array.isArray(dataItems)) {
            dataItems = [];
            this._subFileItemsSetter(directoryDataObj, dataItems);
        }
        return dataItems;
    }

    _getItems(pathInfo) {
        const parentDirKey = pathInfo && pathInfo.length > 0 ? pathInfo[pathInfo.length - 1].key : null;
        let dirFileObjects = this._data;
        if(parentDirKey) {
            const directoryEntry = this._findFileItemObj(pathInfo);
            dirFileObjects = directoryEntry && this._subFileItemsGetter(directoryEntry) || [];
        }
        return this._convertDataObjectsToFileItems(dirFileObjects, pathInfo);
    }

    _findFileItemObj(pathInfo) {
        if(!Array.isArray(pathInfo)) {
            pathInfo = [ ];
        }

        let currentPath = "";
        let fileItemObj = null;
        let fileItemObjects = this._data;
        for(let i = 0; i < pathInfo.length && (i === 0 || fileItemObj); i++) {
            const that = this;
            fileItemObj = find(fileItemObjects, item => {
                const hasCorrectFileItemType = that._isDirGetter(item) || i === pathInfo.length - 1;
                return that._getKeyFromDataObject(item, currentPath) === pathInfo[i].key &&
                    that._nameGetter(item) === pathInfo[i].name && hasCorrectFileItemType;
            });
            if(fileItemObj) {
                currentPath = pathCombine(currentPath, this._nameGetter(fileItemObj));
                fileItemObjects = this._subFileItemsGetter(fileItemObj);
            }
        }
        return fileItemObj;
    }

    _getKeyFromDataObject(dataObj, defaultKeyPrefix) {
        let key = this._keyGetter(dataObj);
        if(!key) {
            key = pathCombine(defaultKeyPrefix, this._nameGetter(dataObj));
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

    _isFileItemExists(fileItem) {
        return fileItem.isDirectory && fileItem.isRoot || !!this._findFileItemObj(fileItem.getFullPathInfo());
    }

}

module.exports = ArrayFileProvider;
