import FileProvider, {
    FileProviderOptions
} from './file_provider';

export interface ArrayFileProviderOptions extends FileProviderOptions<ArrayFileProvider> {
    /**
     * @docid ArrayFileProviderOptions.data
     * @type Array<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: Array<any>;
    /**
     * @docid ArrayFileProviderOptions.itemsExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemsExpr?: string | Function;
}
/**
 * @docid ArrayFileProvider
 * @inherits FileProvider
 * @type object
 * @module ui/file_manager/file_provider/array
 * @namespace DevExpress.fileProvider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class ArrayFileProvider extends FileProvider {
    constructor(options?: ArrayFileProviderOptions)
}
