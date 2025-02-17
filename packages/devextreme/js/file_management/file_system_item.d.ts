/**
 * An object that provides information about a file system item (file or directory) in the FileManager UI component.
 */
export default class FileSystemItem {
    constructor(path: string, isDirectory: boolean, pathKeys?: Array<string>);

    /**
     * The file system item&apos;s path.
     */
    path: string;

    /**
     * The file system item&apos;s path specified in keys.
     */
    pathKeys: Array<string>;

    /**
     * The file system item&apos;s key.
     */
    key: string;

    /**
     * The file system item&apos;s name.
     */
    name: string;

    /**
     * A timestamp that indicates when the file system item was last modified.
     */
    dateModified: Date;

    /**
     * The file system item&apos;s size (in bytes).
     */
    size: number;

    /**
     * Specifies whether the file system item is a directory.
     */
    isDirectory: boolean;

    /**
     * Specifies whether a directory has subdirectories.
     */
    hasSubDirectories: boolean;

    /**
     * An icon (URL) to be used as the file system item&apos;s thumbnail.
     */
    thumbnail: string;

    /**
     * The file system data object that stores information about the file system item (name, size, modification date, etc.).
     */
    dataItem: any;

    /**
     * Gets a file&apos;s extension.
     */
    getFileExtension(): string;
}
