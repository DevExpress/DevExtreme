import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

/** @namespace DevExpress.fileManagement */
export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_param3 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @public
     */
    abortFileUpload?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_param1 item:FileSystemItem
     * @type_function_param2 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @public
     */
    copyItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_param1 parentDirectory:FileSystemItem
     * @type_function_param2 name:string
     * @type_function_return Promise<any>|any
     * @public
     */
    createDirectory?: ((parentDirectory: FileSystemItem, name: string) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_param1 item:FileSystemItem
     * @type_function_return Promise<any>|any
     * @public
     */
    deleteItem?: ((item: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_param1 items:Array<FileSystemItem>
     * @public
     */
    downloadItems?: ((items: Array<FileSystemItem>) => void);

    /**
     * @docid
     * @type_function_param1 parentDirectory:FileSystemItem
     * @type_function_return Promise<Array<object>>|Array<object>
     * @public
     */
    getItems?: ((parentDirectory: FileSystemItem) => PromiseLike<Array<any>> | Array<any>);

    /**
     * @docid
     * @type_function_param1 items:Array<FileSystemItem>
     * @type_function_return Promise<object>|object
     * @public
     */
    getItemsContent?: ((items: Array<FileSystemItem>) => PromiseLike<any> | any);

    /**
     * @docid
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;

    /**
     * @docid
     * @type_function_param1 item:FileSystemItem
     * @type_function_param2 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @public
     */
    moveItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_param1 item:FileSystemItem
     * @type_function_param2 newName:string
     * @type_function_return Promise<any>|any
     * @public
     */
    renameItem?: ((item: FileSystemItem, newName: string) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_param3 destinationDirectory:FileSystemItem
     * @type_function_return Promise<any>|any
     * @public
     */
    uploadFileChunk?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);
}

/**
 * @docid
 * @inherits FileSystemProviderBase
 * @module file_management/custom_provider
 * @namespace DevExpress.fileManagement
 * @export default
 * @public
 */
export default class CustomFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: CustomFileSystemProviderOptions)
}
