import FileSystemItem from "./file_system_item";

/**
 * @docid FileSystemError
 * @module file_management/error
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
 export default class FileSystemError {
   constructor(errorCode?: number, fileSystemItem?: FileSystemItem, errorText?: string)
    /**
     * @docid FileSystemError.fileSystemItem
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    fileSystemItem?: FileSystemItem;

    /**
     * @docid FileSystemError.errorCode
     * @type number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    errorCode?: number;

    /**
     * @docid FileSystemError.errorText
     * @prevFileNamespace DevExpress.fileManagement
     * @default ""
     * @public
     */
     errorText?: string;
}
