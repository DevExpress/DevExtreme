/**
 * @docid FileSystemItem
 * @module file_management/file_system_item
 * @namespace DevExpress.fileManagement
 * @export default
 * @public
 */
export default class FileSystemItem {
    constructor(path: string, isDirectory: boolean, pathKeys?: Array<string>);

    /**
     * @docid FileSystemItem.path
     * @public
     */
    path: string;

    /**
     * @docid FileSystemItem.pathKeys
     * @public
     */
    pathKeys: Array<string>;

    /**
     * @docid FileSystemItem.key
     * @public
     */
    key: string;

    /**
     * @docid FileSystemItem.name
     * @public
     */
    name: string;

    /**
     * @docid FileSystemItem.dateModified
     * @public
     */
    dateModified: Date;

    /**
     * @docid FileSystemItem.size
     * @public
     */
    size: number;

    /**
     * @docid FileSystemItem.isDirectory
     * @public
     */
    isDirectory: boolean;

    /**
     * @docid FileSystemItem.hasSubDirectories
     * @public
     */
    hasSubDirectories: boolean;

    /**
     * @docid FileSystemItem.thumbnail
     * @public
     */
    thumbnail: string;

    /**
     * @docid FileSystemItem.dataItem
     * @public
     */
    dataItem: any;

    /**
     * @docid FileSystemItem.getFileExtension
     * @publicName getFileExtension()
     * @return string
     * @public
     */
    getFileExtension(): string;
}
