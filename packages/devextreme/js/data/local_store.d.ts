import ArrayStore, { ArrayStoreOptions } from './array_store';

/**
 * @docid
 * @namespace DevExpress.data
 * @public
 */
export interface LocalStoreOptions<
    TItem = any,
    TKey = any,
> extends ArrayStoreOptions<TItem, TKey> {
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
 * @options LocalStoreOptions
 */
export class LocalStore<
    TItem = any,
    TKey = any,
> extends ArrayStore<TItem, TKey> {
    constructor(options?: LocalStoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
}

export default LocalStore;

/**
* @deprecated Use LocalStoreOptions from /common/data instead
* @namespace DevExpress.data.LocalStore
*/
export type Options<
  TItem = any,
  TKey = any,
> = LocalStoreOptions<TItem, TKey>;
