import { ensureDefined, noop } from '../../../core/utils/common';
import { isFunction } from '../../../core/utils/type';
import { when } from '../../../core/utils/deferred';
import { compileGetter } from '../../../core/utils/data';

import { FileProvider } from './file_provider';

class CustomFileProvider extends FileProvider {

    constructor(options) {
        options = ensureDefined(options, { });
        super(options);

        this._hasSubDirsGetter = compileGetter(options.hasSubDirectoriesExpr || 'hasSubDirectories');

        this._getItemsFunction = this._ensureFunction(options.getItems, () => []);

        this._renameItemFunction = this._ensureFunction(options.renameItem);

        this._createDirectoryFunction = this._ensureFunction(options.createDirectory);

        this._deleteItemFunction = this._ensureFunction(options.deleteItem);

        this._moveItemFunction = this._ensureFunction(options.moveItem);

        this._copyItemFunction = this._ensureFunction(options.copyItem);

        this._uploadFileChunkFunction = this._ensureFunction(options.uploadFileChunk);

        this._abortFileUploadFunction = this._ensureFunction(options.abortFileUpload);

        this._downloadItemsFunction = this._ensureFunction(options.downloadItems);

        this._getItemsContentFunction = this._ensureFunction(options.getItemsContent);

        this._uploadChunkSize = options.uploadChunkSize;
    }

    getItems(pathInfo) {
        return when(this._getItemsFunction(pathInfo))
            .then(dataItems => this._convertDataObjectsToFileItems(dataItems, pathInfo));
    }

    renameItem(item, name) {
        return this._renameItemFunction(item, name);
    }

    createFolder(parentDir, name) {
        return this._createDirectoryFunction(parentDir, name);
    }

    deleteItems(items) {
        return items.map(item => this._deleteItemFunction(item));
    }

    moveItems(items, destinationDirectory) {
        return items.map(item => this._moveItemFunction(item, destinationDirectory));
    }

    copyItems(items, destinationFolder) {
        return items.map(item => this._copyItemFunction(item, destinationFolder));
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        return this._uploadFileChunkFunction(fileData, chunksInfo, destinationDirectory);
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
        return this._abortFileUploadFunction(fileData, chunksInfo, destinationDirectory);
    }

    downloadItems(items) {
        return this._downloadItemsFunction(items);
    }

    getItemContent(items) {
        return this._getItemsContentFunction(items);
    }

    getFileUploadChunkSize() {
        return ensureDefined(this._uploadChunkSize, super.getFileUploadChunkSize());
    }

    _hasSubDirs(dataObj) {
        const hasSubDirs = this._hasSubDirsGetter(dataObj);
        return typeof hasSubDirs === 'boolean' ? hasSubDirs : true;
    }

    _getKeyExpr(options) {
        return options.keyExpr || 'key';
    }

    _ensureFunction(functionObject, defaultFunction) {
        defaultFunction = defaultFunction || noop;
        return isFunction(functionObject) ? functionObject : defaultFunction;
    }

}

module.exports = CustomFileProvider;
