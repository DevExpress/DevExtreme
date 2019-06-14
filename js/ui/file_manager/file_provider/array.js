import { ensureDefined } from "../../../core/utils/common";
import { compileGetter, compileSetter } from "../../../core/utils/data";
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
        this._subFileItemsSetter = typeUtils.isFunction(itemsExpr) ? itemsExpr : compileSetter(itemsExpr);

        const nameExpr = this._getNameExpr(options);
        this._nameSetter = typeUtils.isFunction(nameExpr) ? nameExpr : compileSetter(nameExpr);

        const isDirExpr = this._getIsDirExpr(options);
        this._getIsDirSetter = typeUtils.isFunction(isDirExpr) ? isDirExpr : compileSetter(isDirExpr);

        this._data = initialArray || [ ];
    }

    getItems(path, itemType) {
        return this._getItems(path, itemType);
    }

    renameItem(item, name) {
        item.dataItem.name = name;
    }

    createFolder(parentFolder, name) {
        let newItem = { };
        this._nameSetter(newItem, name);
        this._getIsDirSetter(newItem, true);

        const array = this._getChildrenArray(parentFolder.dataItem);
        array.push(newItem);
    }

    deleteItems(items) {
        each(items, (_, item) => this._deleteItem(item));
    }

    moveItems(items, destinationDir) {
        let array = this._getChildrenArray(destinationDir.dataItem);
        each(items, (_, item) => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);
            this._deleteItem(item);
            array.push(item.dataItem);
        });
    }

    copyItems(items, destinationDir) {
        const array = this._getChildrenArray(destinationDir.dataItem);
        each(items, (_, item) => {
            this._checkAbilityToMoveOrCopyItem(item, destinationDir);

            const copiedItem = this._createCopy(item.dataItem);
            array.push(copiedItem);
        });
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

    _getChildrenArray(dataItem) {
        if(!dataItem) {
            return this._data;
        }

        let subItems = this._subFileItemsGetter(dataItem);
        if(!Array.isArray(subItems)) {
            subItems = [];
            this._subFileItemsSetter(dataItem, subItems);
        }
        return subItems;
    }

    _getItems(path, itemType) {
        if(path === "" || path === undefined) {
            return this._convertDataObjectsToFileItems(this._data, "", itemType);
        }

        const folderEntry = this._findItem(path);
        const entries = folderEntry && this._subFileItemsGetter(folderEntry) || [];
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
            result = data.filter(entry => this._isDirGetter(entry) && this._nameGetter(entry) === part)[0];
            if(result) {
                const children = this._subFileItemsGetter(result);
                if(children) {
                    data = children;
                } else if(i !== parts.length - 1) {
                    return null;
                }
            } else {
                return null;
            }
        }

        return result;
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

}

module.exports = ArrayFileProvider;
