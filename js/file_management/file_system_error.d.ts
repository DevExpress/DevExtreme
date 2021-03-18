import FileSystemItem from "./file_system_item";

/**
 * @docid
 * @module file_management/error
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
 export default class FileSystemError {
   constructor(errorCode?: Enums.FileManagementFileSystemErrorCode|number, fileSystemItem?: FileSystemItem, errorText?: string)
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    fileSystemItem?: FileSystemItem;

    /**
     * @docid
     * @type Enums.FileManagementFileSystemErrorCode|number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    errorCode?: 'noAccess' | 'fileExists' | 'fileNotFound' | 'directoryExists' | 'directoryNotFound' | 'wrongFileExtension' | 'maxFileSizeExceeded' | 'invalidSymbols' | 'other' | number;

    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @default ""
     * @public
     */
     errorText?: string;
}
