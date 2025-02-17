import FileSystemItem from './file_system_item';

/**
 * An object that contains information about the error.
 */
export default class FileSystemError {
   constructor(errorCode?: number, fileSystemItem?: FileSystemItem, errorText?: string);
    /**
     * The processed file or directory.
     */
    fileSystemItem?: FileSystemItem;

    /**
     * The error code.
     */
    errorCode?: number;

    /**
      * The error message.
      */
     errorText?: string;
}
