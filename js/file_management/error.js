class FileSystemError {
    constructor(errorCode, fileSystemItem, errorText) {
        this.errorCode = errorCode;
        this.fileSystemItem = fileSystemItem;
        this.errorText = errorText;
    }
}

export default FileSystemError;
