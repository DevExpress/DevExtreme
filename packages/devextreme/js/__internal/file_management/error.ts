import type FileSystemItem from '@ts/file_management/file_system_item';

class FileSystemError {
  errorCode?: number;

  fileSystemItem?: FileSystemItem;

  errorText?: string;

  constructor(errorCode: number, fileSystemItem?: FileSystemItem, errorText?: string) {
    this.errorCode = errorCode;
    this.fileSystemItem = fileSystemItem;
    this.errorText = errorText;
  }
}

export default FileSystemError;
