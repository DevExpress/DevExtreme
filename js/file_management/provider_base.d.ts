import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

import {
    DxPromise,
} from '../core/utils/deferred';

/**
 * @namespace DevExpress.fileManagement
 * @docid
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
    /**
     * @docid
     * @public
     */
    dateModifiedExpr?: string | Function;
    /**
     * @docid
     * @public
     */
    isDirectoryExpr?: string | Function;
    /**
     * @docid
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @public
     */
    nameExpr?: string | Function;
    /**
     * @docid
     * @public
     */
    sizeExpr?: string | Function;
    /**
     * @docid
     * @public
     */
    thumbnailExpr?: string | Function;
}
/**
 * @docid
 * @namespace DevExpress.fileManagement
 * @hidden
 * @options FileSystemProviderBaseOptions
 */
export default class FileSystemProviderBase {
    constructor(options?: FileSystemProviderBaseOptions);
    /**
     * @docid
     * @publicName getItems()
     * @return Promise<Array<FileSystemItem>>
     * @public
     */
    getItems(parentDirectory: FileSystemItem): DxPromise<Array<FileSystemItem>>;

    /**
     * @docid
     * @publicName renameItem()
     * @return Promise<any>
     * @public
     */
    renameItem(item: FileSystemItem, newName: string): DxPromise<any>;

    /**
     * @docid
     * @publicName createDirectory()
     * @return Promise<any>
     * @public
     */
    createDirectory(parentDirectory: FileSystemItem, name: string): DxPromise<any>;

    /**
     * @docid
     * @publicName deleteItems()
     * @return Array<Promise<any>>
     * @public
     */
    deleteItems(items: Array<FileSystemItem>): Array<DxPromise<any>>;

    /**
     * @docid
     * @publicName moveItems()
     * @return Array<Promise<any>>
     * @public
     */
    moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * @docid
     * @publicName copyItems()
     * @return Array<Promise<any>>
     * @public
     */
    copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * @docid
     * @publicName uploadFileChunk()
     * @return Promise<any>
     * @public
     */
    uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * @docid
     * @publicName abortFileUpload()
     * @return Promise<any>
     * @public
     */
    abortFileUpload(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * @docid
     * @publicName downloadItems()
     * @public
     */
    downloadItems(items: Array<FileSystemItem>): void;

    /**
     * @docid
     * @publicName getItemsContent()
     * @return Promise<object>
     * @public
     */
    getItemsContent(items: Array<FileSystemItem>): DxPromise<any>;
}
