import { find } from '../../../core/utils/array';
import { ensureDefined } from '../../../core/utils/common';
import { compileGetter, compileSetter } from '../../../core/utils/data';
import Guid from '../../../core/guid';
import typeUtils from '../../../core/utils/type';
import { errors } from '../../../data/errors';
import { Deferred } from '../../../core/utils/deferred';
import { getWindow } from '../../../core/utils/window';
import { fileSaver } from '../../../exporter/file_saver';
import Errors from '../../widget/ui.errors';

import { FileProvider } from './file_provider';
import { ErrorCode } from '../ui.file_manager.common';
import { pathCombine } from '../ui.file_manager.utils';

const window = getWindow();

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
            throw errors.Error('E4006');
        }

        /**
         * @name ArrayFileProviderOptions.data
         * @type Array<any>
         */
        /**
         * @name ArrayFileProviderOptions.itemsExpr
         * @type string|function(fileItem)
         */
        /**
         * @name ArrayFileProviderOptions.contentExpr
         * @type string|function(fileItem)
         */

        const itemsExpr = options.itemsExpr || 'items';
        this._subFileItemsGetter = compileGetter(itemsExpr);
        this._subFileItemsSetter = this._getSetter(itemsExpr);

        const contentExpr = options.contentExpr || 'content';
        this._contentGetter = compileGetter(contentExpr);
        this._contentSetter = this._getSetter(contentExpr);

        const nameExpr = this._getNameExpr(options);
        this._nameSetter = this._getSetter(nameExpr);

        const isDirExpr = this._getIsDirExpr(options);
        this._getIsDirSetter = this._getSetter(isDirExpr);

        const keyExpr = this._getKeyExpr(options);
        this._keySetter = this._getSetter(keyExpr);

        const sizeExpr = this._getSizeExpr(options);
        this._sizeSetter = this._getSetter(sizeExpr);

        const dateModifiedExpr = this._getDateModifiedExpr(options);
        this._dateModifiedSetter = this._getSetter(dateModifiedExpr);

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
        this._validateDirectoryExists(parentDir);
        this._createDataObject(parentDir, name, true);
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

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        if(chunksInfo.chunkIndex > 0) {
            return chunksInfo.customData.deferred;
        }

        this._validateDirectoryExists(destinationDirectory);

        const deferred = chunksInfo.customData.deferred = new Deferred();
        const reader = this._createFileReader();
        reader.readAsDataURL(fileData);

        reader.onload = () => {
            const content = reader.result.split(',')[1];

            const dataObj = this._createDataObject(destinationDirectory, fileData.name, false);
            this._sizeSetter(dataObj, fileData.size);
            this._dateModifiedSetter(dataObj, fileData.lastModifiedDate);
            this._contentSetter(dataObj, content);

            deferred.resolve();
        };

        reader.onerror = error => deferred.reject(error);

        return deferred;
    }

    downloadItems(items) {
        if(items.length === 1) {
            this._downloadSingleFile(items[0]);
        } else {
            this._downloadMultipleFiles(items);
        }
    }

    _downloadSingleFile(file) {
        const content = this._getFileContent(file);

        const byteString = window.atob(content);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const array = new Uint8Array(arrayBuffer);

        for(let i = 0; i < byteString.length; i++) {
            array[i] = byteString.charCodeAt(i);
        }

        const blob = new window.Blob([arrayBuffer], { type: 'application/octet-stream' });
        fileSaver.saveAs(file.name, null, blob);
    }

    _downloadMultipleFiles(files) {
        const jsZip = getJSZip();
        const zip = new jsZip();

        files.forEach(file => zip.file(file.name, this._getFileContent(file), { base64: true }));

        const options = {
            type: 'blob',
            compression: 'DEFLATE',
            mimeType: 'application/zip'
        };
        const deferred = new Deferred();

        if(zip.generateAsync) {
            zip.generateAsync(options).then(deferred.resolve);
        } else {
            deferred.resolve(zip.generate(options));
        }

        deferred.done(blob => fileSaver.saveAs('files.zip', null, blob));
    }

    _getFileContent(file) {
        return this._contentGetter(file.dataItem) || '';
    }

    _validateDirectoryExists(directoryInfo) {
        if(!this._isFileItemExists(directoryInfo) || this._isDirGetter(directoryInfo.fileItem)) {
            throw {
                errorId: ErrorCode.DirectoryNotFound,
                fileItem: directoryInfo
            };
        }
    }

    _checkAbilityToMoveOrCopyItem(item, destinationDir) {
        const itemKey = this._getKeyFromDataObject(item.dataItem, item.parentPath);
        const pathInfo = destinationDir.getFullPathInfo();
        let currentPath = '';

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

    _createDataObject(parentDir, name, isDirectory) {
        const dataObj = { };

        this._nameSetter(dataObj, name);
        this._getIsDirSetter(dataObj, isDirectory);
        this._keySetter(dataObj, String(new Guid()));

        const array = this._getDirectoryDataItems(parentDir.dataItem);
        array.push(dataObj);

        if(isDirectory) {
            this._updateHasSubDirs(parentDir);
        }

        return dataObj;
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
        const names = {};

        dataObjects.forEach(obj => {
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

        let currentPath = '';
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

    _createFileReader() {
        return new window.FileReader();
    }

}

let JSZip;

function getJSZip() {
    if(!JSZip) {
        JSZip = requestJSZip();
    }

    return JSZip;
}

function requestJSZip() {
    const window = getWindow();
    const jsZip = window && window.JSZip || require('jszip');

    if(!jsZip) {
        throw Errors.Error('E1041', 'JSZip');
    }

    return jsZip;
}

module.exports = ArrayFileProvider;
