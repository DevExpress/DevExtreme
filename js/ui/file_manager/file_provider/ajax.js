import ajax from '../../../core/utils/ajax';
import { ensureDefined } from '../../../core/utils/common';
import { Deferred } from '../../../core/utils/deferred';
import { extend } from '../../../core/utils/extend';
import { FileProvider } from './file_provider';
import ArrayFileProvider from './array';

/**
* @name AjaxFileProvider
* @inherits FileProvider
* @type object
* @module ui/file_manager/file_provider/ajax
* @namespace DevExpress.fileProvider
* @export default
*/
class AjaxFileProvider extends FileProvider {

    constructor(options) {
        options = ensureDefined(options, { });
        super(options);

        /**
         * @name AjaxFileProviderOptions.url
         * @type string
         */
        /**
         * @name AjaxFileProviderOptions.itemsExpr
         * @type string|function(fileItem)
         */
        this._options = options;
        this._provider = null;
    }

    getItems(pathInfo) {
        return this._doActionAfterDataAcquired(() => this._provider.getItems(pathInfo));
    }

    renameItem(item, name) {
        return this._doActionAfterDataAcquired(() => this._provider.renameItem(item, name));
    }

    createFolder(parentDir, name) {
        return this._doActionAfterDataAcquired(() => this._provider.createFolder(parentDir, name));
    }

    deleteItems(items) {
        return this._doActionAfterDataAcquired(() => this._provider.deleteItems(items));
    }

    moveItems(items, destinationFolder) {
        return this._doActionAfterDataAcquired(() => this._provider.moveItems(items, destinationFolder));
    }

    copyItems(items, destinationFolder) {
        return this._doActionAfterDataAcquired(() => this._provider.copyItems(items, destinationFolder));
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        return this._doActionAfterDataAcquired(() => this._provider.uploadFileChunk(fileData, chunksInfo, destinationDirectory));
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
        return this._doActionAfterDataAcquired(() => this._provider.abortFileUpload(fileData, chunksInfo, destinationDirectory));
    }

    _doActionAfterDataAcquired(action) {
        return this._ensureDataAcquired().then(action.bind(this));
    }

    _ensureDataAcquired() {
        if(this._provider) {
            return new Deferred().resolve().promise();
        }

        return this._getData()
            .done(data => {
                const arrayOptions = extend(this._options, { data });
                this._provider = new ArrayFileProvider(arrayOptions);
            });
    }

    _getData() {
        return ajax.sendRequest({
            url: this._options.url,
            dataType: 'json',
            cache: false
        });
    }

}

module.exports = AjaxFileProvider;
