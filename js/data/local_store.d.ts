import ArrayStore, {
    ArrayStoreOptions,
} from './array_store';

/** @public */
export type Options<
    TValue = any,
    TKey = any,
> = LocalStoreOptions<TValue, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface LocalStoreOptions<
    TValue = any,
    TKey = any,
> extends ArrayStoreOptions<TValue, TKey> {
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
export default class LocalStore<
    TValue = any,
    TKey = any,
> extends ArrayStore<TValue, TKey> {
    constructor(options?: Options<TValue, TKey>)
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
}
