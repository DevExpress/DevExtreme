import FileProvider, {
    FileProviderOptions
} from './file_provider';

export interface CustomFileProviderOptions extends FileProviderOptions<CustomFileProvider> {
    /**
     * @docid CustomFileProviderOptions.abortFileUpload
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortFileUpload?: Function;
    /**
     * @docid CustomFileProviderOptions.copyItem
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    copyItem?: Function;
    /**
     * @docid CustomFileProviderOptions.createDirectory
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    createDirectory?: Function;
    /**
     * @docid CustomFileProviderOptions.deleteItem
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteItem?: Function;
    /**
     * @docid CustomFileProviderOptions.downloadItems
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    downloadItems?: Function;
    /**
     * @docid CustomFileProviderOptions.getItems
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItems?: Function;
    /**
     * @docid CustomFileProviderOptions.getItemsContent
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItemsContent?: Function;
    /**
     * @docid CustomFileProviderOptions.hasSubDirectoriesExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * @docid CustomFileProviderOptions.moveItem
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    moveItem?: Function;
    /**
     * @docid CustomFileProviderOptions.renameItem
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renameItem?: Function;
    /**
     * @docid CustomFileProviderOptions.uploadChunkSize
     * @type number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadChunkSize?: number;
    /**
     * @docid CustomFileProviderOptions.uploadFileChunk
     * @type function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFileChunk?: Function;
}
/**
 * @docid CustomFileProvider
 * @inherits FileProvider
 * @type object
 * @module ui/file_manager/file_provider/custom
 * @namespace DevExpress.fileProvider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class CustomFileProvider extends FileProvider {
    constructor(options?: CustomFileProviderOptions)
}
