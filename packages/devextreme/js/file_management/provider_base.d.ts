import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

import {
    DxPromise,
} from '../core/utils/deferred';

/**
                                                               * 
                                                               * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
                                                               */
                                                              export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
    /**
     * Specifies which data field provides timestamps that indicate when a file was last modified.
     */
    dateModifiedExpr?: string | Function;
    /**
     * Specifies which data field provides information about whether a file system item is a directory.
     */
    isDirectoryExpr?: string | Function;
    /**
     * Specifies the data field that provides keys.
     */
    keyExpr?: string | Function;
    /**
     * Specifies which data field provides file and directory names.
     */
    nameExpr?: string | Function;
    /**
     * Specifies which data field provides file sizes.
     */
    sizeExpr?: string | Function;
    /**
     * Specifies which data field provides icons to be used as thumbnails.
     */
    thumbnailExpr?: string | Function;
}
/**
 * Contains base provider settings.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class FileSystemProviderBase {
    constructor(options?: FileSystemProviderBaseOptions);
    /**
     * Gets file system items.
     */
    getItems(parentDirectory: FileSystemItem): DxPromise<Array<FileSystemItem>>;

    /**
     * Renames a file or directory.
     */
    renameItem(item: FileSystemItem, newName: string): DxPromise<any>;

    /**
     * Creates a directory.
     */
    createDirectory(parentDirectory: FileSystemItem, name: string): DxPromise<any>;

    /**
     * Deletes files or directories.
     */
    deleteItems(items: Array<FileSystemItem>): Array<DxPromise<any>>;

    /**
     * Moves files and directories.
     */
    moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * Copies files or directories.
     */
    copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * Uploads a file in chunks.
     */
    uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * Cancels the file upload.
     */
    abortFileUpload(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * Downloads files.
     */
    downloadItems(items: Array<FileSystemItem>): void;

    /**
     * Gets items content.
     */
    getItemsContent(items: Array<FileSystemItem>): DxPromise<any>;
}
