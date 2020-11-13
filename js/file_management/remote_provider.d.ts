import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * @docid RemoteFileSystemProviderOptions.endpointUrl
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    endpointUrl?: string;
    /**
     * @docid RemoteFileSystemProviderOptions.hasSubDirectoriesExpr
     * @type string|function(fileSystemItem)
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
}
/**
 * @docid RemoteFileSystemProvider
 * @inherits FileSystemProviderBase
 * @type object
 * @module file_management/remote_provider
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: RemoteFileSystemProviderOptions)
}
