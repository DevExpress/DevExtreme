import {
    JQueryPromise
} from '../../../common';

export interface FileProviderOptions<T = FileProvider> {
    /**
     * @docid FileProviderOptions.dateModifiedExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateModifiedExpr?: string | Function;
    /**
     * @docid FileProviderOptions.isDirectoryExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isDirectoryExpr?: string | Function;
    /**
     * @docid FileProviderOptions.keyExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid FileProviderOptions.nameExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nameExpr?: string | Function;
    /**
     * @docid FileProviderOptions.sizeExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sizeExpr?: string | Function;
    /**
     * @docid FileProviderOptions.thumbnailExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    thumbnailExpr?: string | Function;
}
/**
 * @docid FileProvider
 * @type object
 * @module ui/file_manager/file_provider/file_provider
 * @namespace DevExpress.fileProvider
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class FileProvider {
    constructor(options?: FileProviderOptions)
    /**
     * @docid FileProviderMethods.getItemContent
     * @publicName getItemContent()
     * @param1 items:Array<object>
     * @return Promise<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItemContent(items: Array<any>): Promise<any> & JQueryPromise<any>;
}
