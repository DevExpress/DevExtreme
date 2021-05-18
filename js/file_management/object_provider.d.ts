import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

/** @namespace DevExpress.fileManagement */
export interface ObjectFileSystemProviderOptions extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    contentExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    data?: Array<any>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    itemsExpr?: string | Function;
}
/**
 * @docid
 * @inherits FileSystemProviderBase
 * @module file_management/object_provider
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default class ObjectFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: ObjectFileSystemProviderOptions)
}
