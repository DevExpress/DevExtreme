import FileSystemErrorCode from './error_codes';

export default class FileSystemError {
    constructor(errorCode = FileSystemErrorCode.Other, fileSystemItem, errorText = '') {
        this.errorId = errorCode;
        this.fileSystemItem = fileSystemItem;
        this.errorText = errorText;
    }
}
