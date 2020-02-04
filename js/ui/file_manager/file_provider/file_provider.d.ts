import '../../../jquery_augmentation';

export interface FileProviderOptions<T = FileProvider> {
    /**
     * @docid FileProviderOptions.dateModifiedExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateModifiedExpr?: string | Function;
    /**
     * @docid FileProviderOptions.isDirectoryExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isDirectoryExpr?: string | Function;
    /**
     * @docid FileProviderOptions.keyExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid FileProviderOptions.nameExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nameExpr?: string | Function;
    /**
     * @docid FileProviderOptions.sizeExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sizeExpr?: string | Function;
    /**
     * @docid FileProviderOptions.thumbnailExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    thumbnailExpr?: string | Function;
}
/**
 * @docid FileProvider
 * @type object
 * @module ui/file_manager/file_provider/file_provider
 * @namespace DevExpress.fileProvider
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class FileProvider {
    constructor(options?: FileProviderOptions)
    /**
     * @docid FileProviderMethods.getItems
     * @publicName getItems()
     * @param1 pathInfo:object
     * @return Promise<Array<object>>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItems(pathInfo: any): Promise<Array<any>> & JQueryPromise<Array<any>>;

    /**
     * @docid FileProviderMethods.renameItem
     * @publicName renameItem()
     * @param1 item:object
     * @param2 newName:string
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renameItem(item: any, newName: string): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileProviderMethods.createFolder
     * @publicName createFolder()
     * @param1 parentDirectory:object
     * @param2 name:string
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    createFolder(parentDirectory: any, name: string): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileProviderMethods.deleteItems
     * @publicName deleteItems()
     * @param1 items:Array<object>
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteItems(items: Array<any>): Array<Promise<any> & JQueryPromise<any>>;

    /**
     * @docid FileProviderMethods.moveItems
     * @publicName moveItems()
     * @param1 items:Array<object>
     * @param2 destinationDirectory:object
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    moveItems(items: Array<any>, destinationDirectory: any): Array<Promise<any> & JQueryPromise<any>>;

    /**
     * @docid FileProviderMethods.copyItems
     * @publicName copyItems()
     * @param1 items:Array<object>
     * @param2 destinationDirectory:object
     * @return Array<Promise<any>>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    copyItems(items: Array<any>, destinationDirectory: any): Array<Promise<any> & JQueryPromise<any>>;

    /**
     * @docid FileProviderMethods.uploadFileChunk
     * @publicName uploadFileChunk()
     * @param1 fileData:File
     * @param2 uploadInfo:object
     * @param3 destinationDirectory:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFileChunk(fileData: File, uploadInfo: any, destinationDirectory: any): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileProviderMethods.abortFileUpload
     * @publicName abortFileUpload()
     * @param1 fileData:File
     * @param2 uploadInfo:object
     * @param3 destinationDirectory:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortFileUpload(fileData: File, uploadInfo: any, destinationDirectory: any): Promise<any> & JQueryPromise<any>;

    /**
     * @docid FileProviderMethods.downloadItems
     * @publicName downloadItems()
     * @param1 items:Array<object>
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    downloadItems(items: Array<any>): any;

    /**
     * @docid FileProviderMethods.getItemContent
     * @publicName getItemContent()
     * @param1 items:Array<object>
     * @return Promise<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItemContent(items: Array<any>): Promise<any> & JQueryPromise<any>;
}
