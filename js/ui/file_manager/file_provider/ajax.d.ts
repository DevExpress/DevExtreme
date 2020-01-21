import FileProvider, {
    FileProviderOptions
} from './file_provider';

export interface AjaxFileProviderOptions extends FileProviderOptions<AjaxFileProvider> {
    /**
     * @docid AjaxFileProviderOptions.itemsExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemsExpr?: string | Function;
    /**
     * @docid AjaxFileProviderOptions.url
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    url?: string;
}
/**
 * @docid AjaxFileProvider
 * @inherits FileProvider
 * @type object
 * @module ui/file_manager/file_provider/ajax
 * @namespace DevExpress.fileProvider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class AjaxFileProvider extends FileProvider {
    constructor(options?: AjaxFileProviderOptions)
}
