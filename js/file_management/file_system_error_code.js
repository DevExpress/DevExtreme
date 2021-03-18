/**
* @docid
* @module file_management/error_codes
* @namespace DevExpress.fileManagement
* @export default
* @prevFileNamespace DevExpress.fileManagement
* @public
* @name FileSystemErrorCode
*/
const ErrorCode = {
    /**
    *@name FileSystemErrorCode.NoAccess
    */
    NoAccess: 0,
    /**
    *@name FileSystemErrorCode.FileExists
    */
    FileExists: 1,
    /**
    *@name FileSystemErrorCode.FileNotFound
    */
    FileNotFound: 2,
    /**
    *@name FileSystemErrorCode.DirectoryExists
    */
    DirectoryExists: 3,
    /**
    *@name FileSystemErrorCode.DirectoryNotFound
    */
    DirectoryNotFound: 4,
    /**
    *@name FileSystemErrorCode.WrongFileExtension
    */
    WrongFileExtension: 5,
    /**
    *@name FileSystemErrorCode.MaxFileSizeExceeded
    */
    MaxFileSizeExceeded: 6,
    /**
    *@name FileSystemErrorCode.InvalidSymbols
    */
    InvalidSymbols: 7,
    /**
    *@name FileSystemErrorCode.Other
    */
    Other: 32767
};

export default ErrorCode;
