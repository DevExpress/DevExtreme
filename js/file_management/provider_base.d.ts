import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

import {
    DxPromise
} from '../core/utils/deferred';

/** @namespace DevExpress.fileManagement */
export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dateModifiedExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    isDirectoryExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    nameExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    sizeExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    thumbnailExpr?: string | Function;
}
/**
 * @docid
 * @module file_management/provider_base
 * @namespace DevExpress.fileManagement
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.fileManagement
 */
export default class FileSystemProviderBase {
    constructor(options?: FileSystemProviderBaseOptions)
    /**
     * @docid
     * @publicName getItems()
     * @param1 parentDirectory:FileSystemItem
     * @return Promise<Array<FileSystemItem>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItems(parentDirectory: FileSystemItem): DxPromise<Array<FileSystemItem>>;

    /**
     * @docid
     * @publicName renameItem()
     * @param1 item:FileSystemItem
     * @param2 newName:string
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    renameItem(item: FileSystemItem, newName: string): DxPromise<any>;

    /**
     * @docid
     * @publicName createDirectory()
     * @param1 parentDirectory:FileSystemItem
     * @param2 name:string
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    createDirectory(parentDirectory: FileSystemItem, name: string): DxPromise<any>;

    /**
     * @docid
     * @publicName deleteItems()
     * @param1 items:Array<FileSystemItem>
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    deleteItems(items: Array<FileSystemItem>): Array<DxPromise<any>>;

    /**
     * @docid
     * @publicName moveItems()
     * @param1 items:Array<FileSystemItem>
     * @param2 destinationDirectory:FileSystemItem
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * @docid
     * @publicName copyItems()
     * @param1 items:Array<FileSystemItem>
     * @param2 destinationDirectory:FileSystemItem
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * @docid
     * @publicName uploadFileChunk()
     * @param1 fileData:File
     * @param2 uploadInfo:UploadInfo
     * @param3 destinationDirectory:FileSystemItem
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * @docid
     * @publicName abortFileUpload()
     * @param1 fileData:File
     * @param2 uploadInfo:UploadInfo
     * @param3 destinationDirectory:FileSystemItem
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    abortFileUpload(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * @docid
     * @publicName downloadItems()
     * @param1 items:Array<FileSystemItem>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    downloadItems(items: Array<FileSystemItem>): void;

    /**
     * @docid
     * @publicName getItemsContent()
     * @param1 items:Array<FileSystemItem>
     * @return Promise<object>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItemsContent(items: Array<FileSystemItem>): DxPromise<any>;
}
