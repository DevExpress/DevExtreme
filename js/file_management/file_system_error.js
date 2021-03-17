const ErrorCode = {
    NoAccess: 0,
    FileExists: 1,
    FileNotFound: 2,
    DirectoryExists: 3,
    DirectoryNotFound: 4,
    WrongFileExtension: 5,
    MaxFileSizeExceeded: 6,
    InvalidSymbols: 7,
    Other: 32767
};

class FileSystemError {
    constructor(errorCode, fileSystemItem, errorText = '') {
        this.errorId = errorCode;
        this.fileSystemItem = fileSystemItem;
        this.errorText = errorText;
    }
}

export default FileSystemError;
export { ErrorCode };
