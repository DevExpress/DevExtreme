import FileSystemProviderBase, {
    FileSystemProviderBaseOptions,
} from './provider_base';

import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

/** @public */
export type Options = CustomFileSystemProviderOptions;

/**
 * @deprecated Use Options instead
 * @namespace DevExpress.fileManagement
 * @docid
 */
export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
    /**
     * @docid
     * @type_function_return Promise<any>|any
     * @public
     */
    abortFileUpload?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_return Promise<any>|any
     * @public
     */
    copyItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_return Promise<any>|any
     * @public
     */
    createDirectory?: ((parentDirectory: FileSystemItem, name: string) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_return Promise<any>|any
     * @public
     */
    deleteItem?: ((item: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @public
     */
    downloadItems?: ((items: Array<FileSystemItem>) => void);

    /**
     * @docid
     * @type_function_return Promise<Array<object>>|Array<object>
     * @public
     */
    getItems?: ((parentDirectory: FileSystemItem) => PromiseLike<Array<any>> | Array<any>);

    /**
     * @docid
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
     * @type_function_return Promise<any>|any
     * @public
     */
    moveItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_return Promise<any>|any
     * @public
     */
    renameItem?: ((item: FileSystemItem, newName: string) => PromiseLike<any> | any);

    /**
     * @docid
     * @type_function_return Promise<any>|any
     * @public
     */
    uploadFileChunk?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);
}

/**
 * @docid
 * @inherits FileSystemProviderBase
 * @namespace DevExpress.fileManagement
 * @public
 */
export default class CustomFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: Options);
}
