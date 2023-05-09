import FileSystemProviderBase, {
    FileSystemProviderBaseOptions,
} from './provider_base';

/** @public */
export type Options = RemoteFileSystemProviderOptions;

/**
 * @deprecated Use Options instead
 * @namespace DevExpress.fileManagement
 * @docid
 */
export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * @docid
     * @type_function_param1_field headers:object
     * @type_function_param1_field xhrFields:object
     * @type_function_param1_field formData:object
     * @public
     */
    beforeAjaxSend?: ((options: { headers?: any; xhrFields?: any; formData?: any }) => void);
    /**
     * @docid
     * @type_function_param1_field formData:object
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
 * @namespace DevExpress.fileManagement
 * @public
 */
export default class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: Options);
}
