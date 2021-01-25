import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * @docid
     * @publicName beforeAjaxSend(request)
     * @type_function_param1 options: object
     * @type_function_param1_field1 headers:object
     * @type_function_param1_field2 xhrFields:object
     * @type_function_param1_field3 formData:string
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    beforeAjaxSend?: ((options: { headers?: any, xhrFields?: any, formData?: any }) => any);
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
