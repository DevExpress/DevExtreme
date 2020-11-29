import '../jquery_augmentation';
import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
    /**
     * @docid FileSystemProviderBaseOptions.dateModifiedExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dateModifiedExpr?: string | Function;
    /**
     * @docid FileSystemProviderBaseOptions.isDirectoryExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    isDirectoryExpr?: string | Function;
    /**
     * @docid FileSystemProviderBaseOptions.keyExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid FileSystemProviderBaseOptions.nameExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    nameExpr?: string | Function;
    /**
     * @docid FileSystemProviderBaseOptions.sizeExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    sizeExpr?: string | Function;
    /**
     * @docid FileSystemProviderBaseOptions.thumbnailExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    thumbnailExpr?: string | Function;
}
/**
 * @docid FileSystemProviderBase
 * @module file_management/provider_base
 * @namespace DevExpress.fileManagement
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.fileManagement
 */
export default class FileSystemProviderBase {
    constructor(options?: FileSystemProviderBaseOptions)
    /**
     * @docid FileSystemProviderBase.getItems
     * @publicName getItems()
     * @param1 parentDirectory:FileSystemItem
     * @return Promise<Array<FileSystemItem>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItems(parentDirectory: FileSystemItem): Promise<Array<FileSystemItem>> & JQueryPromise<Array<FileSystemItem>>;

    /**
     * @docid FileSystemProviderBase.renameItem
     * @publicName renameItem()
     * @param1 item:FileSystemItem
     * @param2 newName:string
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    renameItem(item: FileSystemItem, newName: string): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileSystemProviderBase.createDirectory
     * @publicName createDirectory()
     * @param1 parentDirectory:FileSystemItem
     * @param2 name:string
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileSystemProviderBase.deleteItems
     * @publicName deleteItems()
     * @param1 items:Array<FileSystemItem>
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    deleteItems(items: Array<FileSystemItem>): Array<Promise<any> & JQueryPromise<any>>;

    /**
     * @docid FileSystemProviderBase.moveItems
     * @publicName moveItems()
     * @param1 items:Array<FileSystemItem>
     * @param2 destinationDirectory:FileSystemItem
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> & JQueryPromise<any>>;

    /**
     * @docid FileSystemProviderBase.copyItems
     * @publicName copyItems()
     * @param1 items:Array<FileSystemItem>
     * @param2 destinationDirectory:FileSystemItem
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> & JQueryPromise<any>>;

    /**
     * @docid FileSystemProviderBase.uploadFileChunk
     * @publicName uploadFileChunk()
     * @param1 fileData:File
     * @param2 uploadInfo:UploadInfo
     * @param3 destinationDirectory:FileSystemItem
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileSystemProviderBase.abortFileUpload
     * @publicName abortFileUpload()
     * @param1 fileData:File
     * @param2 uploadInfo:UploadInfo
     * @param3 destinationDirectory:FileSystemItem
     * @return Promise<any>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    abortFileUpload(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileSystemProviderBase.downloadItems
     * @publicName downloadItems()
     * @param1 items:Array<FileSystemItem>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    downloadItems(items: Array<FileSystemItem>): void;

    /**
     * @docid FileSystemProviderBase.getItemsContent
     * @publicName getItemsContent()
     * @param1 items:Array<FileSystemItem>
     * @return Promise<object>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getItemsContent(items: Array<FileSystemItem>): Promise<any> & JQueryPromise<any>;
}
