import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

/** @namespace DevExpress.fileManagement */
export interface ObjectFileSystemProviderOptions extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
    /**
     * @docid
     * @public
     */
    contentExpr?: string | Function;
    /**
     * @docid
     * @public
     */
    data?: Array<any>;
    /**
     * @docid
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
 * @public
 */
export default class ObjectFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: ObjectFileSystemProviderOptions)
}
