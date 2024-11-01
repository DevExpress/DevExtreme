/* eslint-disable max-classes-per-file */
import {
    DxPromise,
} from '../common';

/**
 * @docid
 * @namespace DevExpress.fileManagement
 * @public
 */
export interface UploadInfo {
  /**
   * @docid
   * @public
   */
  bytesUploaded: number;

  /**
   * @docid
   * @public
   */
  chunkCount: number;

  /**
   * @docid
   * @public
   */
  customData: any;

  /**
   * @docid
   * @public
   */
  chunkBlob: Blob;

  /**
   * @docid
   * @public
   */
  chunkIndex: number;
}

/**
 * @namespace DevExpress.fileManagement
 * @docid
 * @type object
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
export class FileSystemProviderBase {
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

/**
 * @docid FileSystemItem
 * @namespace DevExpress.fileManagement
 * @public
 */
export class FileSystemItem {
  constructor(path: string, isDirectory: boolean, pathKeys?: Array<string>);

  /**
   * @docid FileSystemItem.path
   * @public
   */
  path: string;

  /**
   * @docid FileSystemItem.pathKeys
   * @public
   */
  pathKeys: Array<string>;

  /**
   * @docid FileSystemItem.key
   * @public
   */
  key: string;

  /**
   * @docid FileSystemItem.name
   * @public
   */
  name: string;

  /**
   * @docid FileSystemItem.dateModified
   * @public
   */
  dateModified: Date;

  /**
   * @docid FileSystemItem.size
   * @public
   */
  size: number;

  /**
   * @docid FileSystemItem.isDirectory
   * @public
   */
  isDirectory: boolean;

  /**
   * @docid FileSystemItem.hasSubDirectories
   * @public
   */
  hasSubDirectories: boolean;

  /**
   * @docid FileSystemItem.thumbnail
   * @public
   */
  thumbnail: string;

  /**
   * @docid FileSystemItem.dataItem
   * @public
   */
  dataItem: any;

  /**
   * @docid FileSystemItem.getFileExtension
   * @publicName getFileExtension()
   * @public
   */
  getFileExtension(): string;
}

/**
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
* @options CustomFileSystemProviderOptions
*/
export class CustomFileSystemProvider extends FileSystemProviderBase {
  constructor(options?: CustomFileSystemProviderOptions);
}

/**
 * @docid FileSystemError
 * @namespace DevExpress.fileManagement
 * @public
 */
export class FileSystemError {
  constructor(errorCode?: number, fileSystemItem?: FileSystemItem, errorText?: string);
   /**
    * @docid FileSystemError.fileSystemItem
    * @public
    */
   fileSystemItem?: FileSystemItem;

   /**
    * @docid FileSystemError.errorCode
    * @public
    */
   errorCode?: number;

   /**
    * @docid FileSystemError.errorText
    * @public
    */
    errorText?: string;
}

/**
 * @namespace DevExpress.fileManagement
 * @docid
 */
export interface ObjectFileSystemProviderOptions extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
  /**
   * @docid
   * @public
   */
  contentExpr?: string | Function;
  /**
   * @docid
   * @public
   */
  data?: Array<any>;
  /**
   * @docid
   * @public
   */
  itemsExpr?: string | Function;
}

/**
* @docid
* @inherits FileSystemProviderBase
* @namespace DevExpress.fileManagement
* @public
* @options ObjectFileSystemProviderOptions
*/
export class ObjectFileSystemProvider extends FileSystemProviderBase {
  constructor(options?: ObjectFileSystemProviderOptions);
}

/**
 * @namespace DevExpress.fileManagement
 * @docid
 */
export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
  /**
   * @docid
   * @type_function_param1_field headers:object
   * @type_function_param1_field xhrFields:object
   * @type_function_param1_field formData:object
   * @public
   */
  beforeAjaxSend?: ((options: { headers?: any; xhrFields?: any; formData?: any }) => void);
  /**
   * @docid
   * @type_function_param1_field formData:object
   * @public
   */
  beforeSubmit?: ((options: { formData?: any }) => void);
  /**
   * @docid
   * @public
   */
  endpointUrl?: string;
  /**
   * @docid
   * @public
   */
  hasSubDirectoriesExpr?: string | Function;
  /**
   * @docid
   * @default {}
   * @public
   */
  requestHeaders?: any;
}
/**
* @docid
* @inherits FileSystemProviderBase
* @namespace DevExpress.fileManagement
* @public
* @options RemoteFileSystemProviderOptions
*/
export class RemoteFileSystemProvider extends FileSystemProviderBase {
  constructor(options?: RemoteFileSystemProviderOptions);
}
