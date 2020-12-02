/**
 * @docid FileSystemItem
 * @module file_management/file_system_item
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default class FileSystemItem {
    constructor(path: string, isDirectory: boolean, pathKeys?: Array<string>);

    /**
     * @docid FileSystemItem.path
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    path: string;

    /**
     * @docid FileSystemItem.pathKeys
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    pathKeys: Array<string>;

    /**
     * @docid FileSystemItem.key
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    key: string;

    /**
     * @docid FileSystemItem.name
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    name: string;

    /**
     * @docid FileSystemItem.dateModified
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dateModified: Date;

    /**
     * @docid FileSystemItem.size
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    size: number;

    /**
     * @docid FileSystemItem.isDirectory
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    isDirectory: boolean;

    /**
     * @docid FileSystemItem.hasSubDirectories
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectories: boolean;

    /**
     * @docid FileSystemItem.thumbnail
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    thumbnail: string;

    /**
     * @docid FileSystemItem.dataItem
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dataItem: any;

    /**
     * @docid FileSystemItem.getFileExtension
     * @publicName getFileExtension()
     * @return string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getFileExtension(): string;
}
