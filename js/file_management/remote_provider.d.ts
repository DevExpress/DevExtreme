import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * @docid
     * @publicName customizeRequest(request)
     * @type_function_param1 options: object
     * @type_function_param1_field1 request: XMLHttpRequest
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    customizeRequest?: ((options: { request?: XMLHttpRequest }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    endpointUrl?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    requestHeaders?: any;
}
/**
 * @docid
 * @inherits FileSystemProviderBase
 * @module file_management/remote_provider
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: RemoteFileSystemProviderOptions)
}
