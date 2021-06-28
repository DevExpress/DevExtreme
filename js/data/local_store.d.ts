import ArrayStore, {
    ArrayStoreOptions
} from './array_store';

/** @namespace DevExpress.data */
export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
    /**
     * @docid
     * @default 10000
     * @public
     */
    flushInterval?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    immediate?: boolean;
    /**
     * @docid
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @inherits ArrayStore
 * @module data/local_store
 * @export default
 * @public
 */
export default class LocalStore extends ArrayStore {
    constructor(options?: LocalStoreOptions)
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
}
