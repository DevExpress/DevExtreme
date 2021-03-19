/**
* @docid
* @module file_management/error_codes
* @namespace DevExpress.fileManagement
* @export default
* @prevFileNamespace DevExpress.fileManagement
* @public
* @static
* @name FileSystemErrorCode
*/
export default interface FileSystemErrorCode {
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 0
     */
    NoAccess: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 1
     */
    FileExists: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 2
     */
    FileNotFound: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 3
     */
    DirectoryExists: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 4
     */
    DirectoryNotFound: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 5
     */
    WrongFileExtension: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 6
     */
    MaxFileSizeExceeded: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 7
     */
    InvalidSymbols: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     * @static
     * @readonly
     * @default 32767
     */
    Other: number
};
