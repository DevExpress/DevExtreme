import ArrayStore, {
    ArrayStoreOptions,
} from './array_store';

/** @namespace DevExpress.data */
export interface LocalStoreOptions<TKey = any, TValue = any> extends ArrayStoreOptions<TKey, TValue> {
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
 * @public
 */
export default class LocalStore<TKey = any, TValue = any> extends ArrayStore<TKey, TValue> {
    constructor(options?: LocalStoreOptions<TKey, TValue>)
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
}
