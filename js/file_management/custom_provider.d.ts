import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
    /**
     * @docid CustomFileSystemProviderOptions.abortFileUpload
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    abortFileUpload?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.copyItem
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    copyItem?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.createDirectory
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    createDirectory?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.deleteItem
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    deleteItem?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.downloadItems
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    downloadItems?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.getItems
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItems?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.getItemsContent
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItemsContent?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.hasSubDirectoriesExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * @docid CustomFileSystemProviderOptions.moveItem
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    moveItem?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.renameItem
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    renameItem?: Function;
    /**
     * @docid CustomFileSystemProviderOptions.uploadChunkSize
     * @type number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    uploadChunkSize?: number;
    /**
     * @docid CustomFileSystemProviderOptions.uploadFileChunk
     * @type function
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    uploadFileChunk?: Function;
}
/**
 * @docid CustomFileSystemProvider
 * @inherits FileSystemProviderBase
 * @type object
 * @module file_management/custom_provider
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default class CustomFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: CustomFileSystemProviderOptions)
}
