import FileSystemProviderBase, {
    FileSystemProviderBaseOptions,
} from './provider_base';

import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

export type Options = CustomFileSystemProviderOptions;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
    /**
     * A function that cancels the file upload.
     */
    abortFileUpload?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * A function that copies files or directories.
     */
    copyItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * A function that creates a directory.
     */
    createDirectory?: ((parentDirectory: FileSystemItem, name: string) => PromiseLike<any> | any);

    /**
     * A function that deletes a file or directory.
     */
    deleteItem?: ((item: FileSystemItem) => PromiseLike<any> | any);

    /**
     * A function that downloads files.
     */
    downloadItems?: ((items: Array<FileSystemItem>) => void);

    /**
     * A function that gets file system items.
     */
    getItems?: ((parentDirectory: FileSystemItem) => PromiseLike<Array<any>> | Array<any>);

    /**
     * A function that get items content.
     */
    getItemsContent?: ((items: Array<FileSystemItem>) => PromiseLike<any> | any);

    /**
     * A function or the name of a data source field that provides information on whether a file or directory contains sub directories.
     */
    hasSubDirectoriesExpr?: string | Function;

    /**
     * A function that moves files and directories.
     */
    moveItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);

    /**
     * A function that renames files and directories.
     */
    renameItem?: ((item: FileSystemItem, newName: string) => PromiseLike<any> | any);

    /**
     * A function that uploads a file in chunks.
     */
    uploadFileChunk?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => PromiseLike<any> | any);
}

/**
 * A custom file system provider allows you to implement custom APIs to access and use file systems.
 */
export default class CustomFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: Options);
}
