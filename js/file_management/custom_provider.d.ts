import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
    /**
     * @docid CustomFileSystemProviderOptions.abortFileUpload
     * @type function
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_param3 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    abortFileUpload?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.copyItem
     * @type function
     * @type_function_param1 item:FileSystemItem
     * @type_function_param2 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    copyItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.createDirectory
     * @type function
     * @type_function_param1 parentDirectory:FileSystemItem
     * @type_function_param2 name:string
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    createDirectory?: ((parentDirectory: FileSystemItem, name: string) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.deleteItem
     * @type function
     * @type_function_param1 item:FileSystemItem
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    deleteItem?: ((item: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.downloadItems
     * @type function
     * @type_function_param1 items:Array<FileSystemItem>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    downloadItems?: ((items: Array<FileSystemItem>) => any);

    /**
     * @docid CustomFileSystemProviderOptions.getItems
     * @type function
     * @type_function_param1 parentDirectory:FileSystemItem
     * @type_function_return Promise<Array<object>>|Array<object>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItems?: ((parentDirectory: FileSystemItem) => Promise<Array<any>> | JQueryPromise<Array<any>> | Array<any>);

    /**
     * @docid CustomFileSystemProviderOptions.getItemsContent
     * @type function
     * @type_function_param1 items:Array<FileSystemItem>
     * @type_function_return Promise<object>|object
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItemsContent?: ((items: Array<FileSystemItem>) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.hasSubDirectoriesExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;

    /**
     * @docid CustomFileSystemProviderOptions.moveItem
     * @type function
     * @type_function_param1 item:FileSystemItem
     * @type_function_param2 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    moveItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.renameItem
     * @type function
     * @type_function_param1 item:FileSystemItem
     * @type_function_param2 newName:string
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    renameItem?: ((item: FileSystemItem, newName: string) => Promise<any> | JQueryPromise<any> | any);

    /**
     * @docid CustomFileSystemProviderOptions.uploadFileChunk
     * @type function
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_param3 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    uploadFileChunk?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
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
