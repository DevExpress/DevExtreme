import { ensureDefined, noop } from "../../../core/utils/common";
import { isFunction } from "../../../core/utils/type";
import { when } from "../../../core/utils/deferred";
import { compileGetter } from "../../../core/utils/data";

import { FileProvider } from "./file_provider";

/**
* @name CustomFileProvider
* @inherits FileProvider
* @type object
* @module ui/file_manager/file_provider/custom
* @namespace DevExpress.fileProvider
* @export default
*/
export default class CustomFileProvider extends FileProvider {

    constructor(options) {
        options = ensureDefined(options, { });
        super(options);

        /**
         * @name CustomFileProviderOptions.hasSubDirectoriesExpr
         * @type string|function(fileItem)
         */
        this._hasSubDirsGetter = compileGetter(options.hasSubDirectoriesExpr || "hasSubDirectories");

        /**
         * @name CustomFileProviderOptions.getItems
         * @type function
         */
        this._getItemsFunction = this._ensureFunction(options.getItems, () => []);

        /**
         * @name CustomFileProviderOptions.renameItem
         * @type function
         */
        this._renameItemFunction = this._ensureFunction(options.renameItem);

        /**
         * @name CustomFileProviderOptions.createDirectory
         * @type function
         */
        this._createDirectoryFunction = this._ensureFunction(options.createDirectory);

        /**
         * @name CustomFileProviderOptions.deleteItem
         * @type function
         */
        this._deleteItemFunction = this._ensureFunction(options.deleteItem);

        /**
         * @name CustomFileProviderOptions.moveItem
         * @type function
         */
        this._moveItemFunction = this._ensureFunction(options.moveItem);

        /**
         * @name CustomFileProviderOptions.copyItem
         * @type function
         */
        this._copyItemFunction = this._ensureFunction(options.copyItem);

        /**
         * @name CustomFileProviderOptions.uploadFileChunk
         * @type function
         */
        this._uploadFileChunkFunction = this._ensureFunction(options.uploadFileChunk);

        /**
         * @name CustomFileProviderOptions.abortFileUpload
         * @type function
         */
        this._abortFileUploadFunction = this._ensureFunction(options.abortFileUpload);

        /**
         * @name CustomFileProviderOptions.downloadItems
         * @type function
         */
        this._downloadItemsFunction = this._ensureFunction(options.downloadItems);

        /**
         * @name CustomFileProviderOptions.getItemsContent
         * @type function
         */
        this._getItemsContentFunction = this._ensureFunction(options.getItemsContent);

        /**
         * @name CustomFileProviderOptions.uploadChunkSize
         * @type number
         */
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
        return typeof hasSubDirs === "boolean" ? hasSubDirs : true;
    }

    _getKeyExpr(options) {
        return options.keyExpr || "key";
    }

    _ensureFunction(functionObject, defaultFunction) {
        defaultFunction = defaultFunction || noop;
        return isFunction(functionObject) ? functionObject : defaultFunction;
    }

}
