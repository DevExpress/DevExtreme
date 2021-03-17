import FileSystemItem from "./file_system_item";

/**
 * @docid
 * @module file_management/file_system_error
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
 export default interface FileSystemError {
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
     * @public
     */
     errorText?: string;
}
