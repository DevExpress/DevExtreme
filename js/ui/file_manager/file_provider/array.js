import { find } from "../../../core/utils/array";
import { ensureDefined } from "../../../core/utils/common";
import { compileGetter, compileSetter } from "../../../core/utils/data";
import Guid from "../../../core/guid";
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
        item.key = this._ensureDataObjectKey(item.dataItem);
    }

    createFolder(parentDir, name) {
        if(!this._isFileItemExists(parentDir) || this._isDirGetter(parentDir.fileItem)) {
            throw {
                errorId: ErrorCode.DirectoryNotFound,
                fileItem: parentDir
            };
        }

        const newDir = { };
        this._nameSetter(newDir, name);
        this._getIsDirSetter(newDir, true);

        this._keySetter(newDir, String(new Guid()));

        const array = this._getDirectoryDataItems(parentDir.dataItem);
        array.push(newDir);

        this._updateHasSubDirs(parentDir);
    }

    deleteItems(items) {
        items.forEach(item => this._deleteItem(item));
    }

    moveItems(items, destinationDir) {
        const array = this._getDirectoryDataItems(destinationDir.dataItem);
        items.forEach(item => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);
            this._deleteItem(item);
            array.push(item.dataItem);
        });
        this._updateHasSubDirs(destinationDir);
    }

    copyItems(items, destinationDir) {
        const array = this._getDirectoryDataItems(destinationDir.dataItem);
        items.forEach(item => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);

            const copiedItem = this._createCopy(item.dataItem);
            array.push(copiedItem);
        });
        this._updateHasSubDirs(destinationDir);
    }

    _checkAbilityToMoveOrCopyItem(item, destinationDir) {
        const itemKey = this._getKeyFromDataObject(item.dataItem, item.parentPath);
        const pathInfo = destinationDir.getFullPathInfo();
        let currentPath = "";

        pathInfo.forEach(info => {
            currentPath = pathCombine(currentPath, info.name);
            const pathKey = this._getDataObjectKey(info.key, currentPath);
            if(pathKey === itemKey) {
                throw {
                    errorId: ErrorCode.Other,
                    fileItem: item
                };
            }
        });
    }

    _createCopy(dataObj) {
        const copyObj = { };
        this._nameSetter(copyObj, this._nameGetter(dataObj));
        this._getIsDirSetter(copyObj, this._isDirGetter(dataObj));

        const items = this._subFileItemsGetter(dataObj);
        if(Array.isArray(items)) {
            const itemsCopy = [];
            items.forEach(childItem => {
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
        const array = this._getDirectoryDataItems(parentDirDataObj);
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

        this._ensureKeysForDuplicateNameItems(dirFileObjects);

        return this._convertDataObjectsToFileItems(dirFileObjects, pathInfo);
    }

    _ensureKeysForDuplicateNameItems(dataObjects) {
        const dirNames = {};
        const fileNames = {};

        dataObjects.forEach(obj => {
            const names = this._isDirGetter(obj) ? dirNames : fileNames;
            const name = this._nameGetter(obj);
            if(names[name]) {
                this._ensureDataObjectKey(obj);
            } else {
                names[name] = true;
            }
        });
    }

    _findFileItemObj(pathInfo) {
        if(!Array.isArray(pathInfo)) {
            pathInfo = [ ];
        }

        let currentPath = "";
        let fileItemObj = null;
        let fileItemObjects = this._data;
        for(let i = 0; i < pathInfo.length && (i === 0 || fileItemObj); i++) {
            fileItemObj = find(fileItemObjects, item => {
                const hasCorrectFileItemType = this._isDirGetter(item) || i === pathInfo.length - 1;
                return this._getKeyFromDataObject(item, currentPath) === pathInfo[i].key &&
                    this._nameGetter(item) === pathInfo[i].name && hasCorrectFileItemType;
            });
            if(fileItemObj) {
                currentPath = pathCombine(currentPath, this._nameGetter(fileItemObj));
                fileItemObjects = this._subFileItemsGetter(fileItemObj);
            }
        }
        return fileItemObj;
    }

    _getKeyFromDataObject(dataObj, defaultKeyPrefix) {
        const key = this._keyGetter(dataObj);
        const relativeName = pathCombine(defaultKeyPrefix, this._nameGetter(dataObj));
        return this._getDataObjectKey(key, relativeName);
    }

    _getDataObjectKey(key, relativeName) {
        return key ? key : relativeName;
    }

    _ensureDataObjectKey(dataObj) {
        let key = this._keyGetter(dataObj);
        if(!key) {
            key = String(new Guid());
            this._keySetter(dataObj, key);
        }
        return key;
    }

    _updateHasSubDirs(dir) {
        if(dir && !dir.isRoot) {
            dir.hasSubDirs = this._hasSubDirs(dir.dataItem);
        }
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
