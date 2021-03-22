export default class FileSystemError {
    constructor(errorCode, fileSystemItem, errorText = '') {
        this.errorId = errorCode;
        this.fileSystemItem = fileSystemItem;
        this.errorText = errorText;
    }
}
