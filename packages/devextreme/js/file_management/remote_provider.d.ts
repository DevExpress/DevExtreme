import FileSystemProviderBase, {
    FileSystemProviderBaseOptions,
} from './provider_base';

export type Options = RemoteFileSystemProviderOptions;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * Specifies a function that customizes an Ajax request before it is sent to the server.
     */
    beforeAjaxSend?: ((options: { headers?: any; xhrFields?: any; formData?: any }) => void);
    /**
     * Specifies a function that customizes a form submit request before it is sent to the server.
     */
    beforeSubmit?: ((options: { formData?: any }) => void);
    /**
     * Specifies the URL of an endpoint used to access and modify a file system located on the server.
     */
    endpointUrl?: string;
    /**
     * Specifies which data field provides information about whether a directory has subdirectories.
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * Specifies the request headers.
     */
    requestHeaders?: any;
}
/**
 * The Remote file system provider works with a file system located on the server.
 */
export default class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: Options);
}
