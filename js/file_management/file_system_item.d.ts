/**
 * @docid FileSystemItem
 * @type object
 * @module file_management/file_system_item
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default class FileSystemItem {
    constructor(path: string, isDirectory: boolean, pathKeys?: Array<string>);

    /**
     * @docid FileSystemItemFields.path
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    path: string;

    /**
     * @docid FileSystemItemFields.pathKeys
     * @type Array<string>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    pathKeys: Array<string>;

    /**
     * @docid FileSystemItemFields.key
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    key: string;

    /**
     * @docid FileSystemItemFields.name
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    name: string;

    /**
     * @docid FileSystemItemFields.dateModified
     * @type Date
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dateModified: Date;

    /**
     * @docid FileSystemItemFields.size
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    size: number;

    /**
     * @docid FileSystemItemFields.isDirectory
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    isDirectory: boolean;

    /**
     * @docid FileSystemItemFields.hasSubDirectories
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectories: boolean;

    /**
     * @docid FileSystemItemFields.thumbnail
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    thumbnail: string;

    /**
     * @docid FileSystemItemFields.dataItem
     * @type object
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dataItem: any;

    /**
     * @docid FileSystemItemMethods.getFileExtension
     * @publicName getFileExtension()
     * @return string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getFileExtension(): string;
}
