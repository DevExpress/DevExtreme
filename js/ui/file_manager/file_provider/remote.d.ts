import FileProvider, {
    FileProviderOptions
} from './file_provider';

export interface RemoteFileProviderOptions extends FileProviderOptions<RemoteFileProvider> {
    /**
     * @docid RemoteFileProviderOptions.endpointUrl
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endpointUrl?: string;
    /**
     * @docid RemoteFileProviderOptions.hasSubDirectoriesExpr
     * @type string|function(fileItem)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
}
/**
 * @docid RemoteFileProvider
 * @inherits FileProvider
 * @type object
 * @module ui/file_manager/file_provider/remote
 * @namespace DevExpress.fileProvider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class RemoteFileProvider extends FileProvider {
    constructor(options?: RemoteFileProviderOptions)
}
