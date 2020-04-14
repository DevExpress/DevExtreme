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
     * @type string
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
     * @type string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    key: string;

    /**
     * @docid FileSystemItemFields.name
     * @type string
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
     * @type number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    size: number;

    /**
     * @docid FileSystemItemFields.isDirectory
     * @type boolean
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    isDirectory: boolean;

    /**
     * @docid FileSystemItemFields.hasSubDirectories
     * @type boolean
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectories: boolean;

    /**
     * @docid FileSystemItemFields.thumbnail
     * @type string
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
}
