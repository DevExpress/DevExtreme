/**
 * @docid
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
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    path: string;

    /**
     * @docid
     * @type Array<string>
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    pathKeys: Array<string>;

    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    key: string;

    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    name: string;

    /**
     * @docid
     * @type Date
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dateModified: Date;

    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    size: number;

    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    isDirectory: boolean;

    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectories: boolean;

    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    thumbnail: string;

    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    dataItem: any;

    /**
     * @docid
     * @publicName getFileExtension()
     * @return string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    getFileExtension(): string;
}
