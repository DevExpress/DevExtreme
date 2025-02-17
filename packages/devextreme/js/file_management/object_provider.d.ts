import FileSystemProviderBase, {
    FileSystemProviderBaseOptions,
} from './provider_base';

export type Options = ObjectFileSystemProviderOptions;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ObjectFileSystemProviderOptions extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
    /**
     * Specifies which data field provides information about files content.
     */
    contentExpr?: string | Function;
    /**
     * Specifies an array of data objects that represent files and directories.
     */
    data?: Array<any>;
    /**
     * Specifies which data field provides information about nested files and directories.
     */
    itemsExpr?: string | Function;
}
/**
 * The Object file system provider works with a file system represented by an in-memory array of JSON objects.
 */
export default class ObjectFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: Options);
}
