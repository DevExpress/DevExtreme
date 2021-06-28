import FileSystemProviderBase, {
    FileSystemProviderBaseOptions
} from './provider_base';

/** @namespace DevExpress.fileManagement */
export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * @docid
     * @type_function_param1 options: object
     * @type_function_param1_field1 headers:object
     * @type_function_param1_field2 xhrFields:object
     * @type_function_param1_field3 formData:object
     * @public
     */
    beforeAjaxSend?: ((options: { headers?: any, xhrFields?: any, formData?: any }) => void);
    /**
     * @docid
     * @type_function_param1 options: object
     * @type_function_param1_field1 formData:object
     * @public
     */
    beforeSubmit?: ((options: { formData?: any }) => void);
    /**
     * @docid
     * @public
     */
    endpointUrl?: string;
    /**
     * @docid
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * @docid
     * @default {}
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
 * @public
 */
export default class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: RemoteFileSystemProviderOptions)
}
