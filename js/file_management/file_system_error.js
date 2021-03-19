import FileSystemErrorCodes from './error_codes';

export default class FileSystemError {
    constructor(errorCode = FileSystemErrorCodes.Other, fileSystemItem, errorText = '') {
        this.errorId = errorCode;
        this.fileSystemItem = fileSystemItem;
        this.errorText = errorText;
    }
}
