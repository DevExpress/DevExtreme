import ArrayStore, {
    ArrayStoreOptions
} from './array_store';

/** @namespace DevExpress.data */
export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
    /**
     * @docid
     * @default 10000
     * @prevFileNamespace DevExpress.data
     * @public
     */
    flushInterval?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    immediate?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @inherits ArrayStore
 * @module data/local_store
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class LocalStore extends ArrayStore {
    constructor(options?: LocalStoreOptions)
    /**
     * @docid
     * @publicName clear()
     * @prevFileNamespace DevExpress.data
     * @public
     */
    clear(): void;
}
