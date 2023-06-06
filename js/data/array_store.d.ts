import Store, {
    Options as StoreOptions,
} from './abstract_store';
import { Query } from './query';
import { DxPromise } from '../core/utils/deferred';
import { LoadOptions } from './index';

/** @public */
export type Options<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 * @docid
 */
export interface ArrayStoreOptions<
    TItem = any,
    TKey = any,
> extends StoreOptions<TItem, TKey> {
    /**
     * @docid
     * @public
     */
    data?: Array<TItem>;
}
/**
 * @docid
 * @inherits Store
 * @public
 * @options ArrayStoreOptions
 */
export default class ArrayStore<
    TItem = any,
    TKey = any,
> extends Store<TItem, TKey> {
    constructor(options?: Options<TItem, TKey>);
    byKey(key: TKey): DxPromise<TItem>;
    /**
     * @docid
     * @publicName byKey(key, extraOptions)
     * @hidden
     */
    byKey(key: TKey, extraOptions: LoadOptions<TItem>): DxPromise<TItem>;
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
    /**
     * @docid
     * @publicName createQuery()
     * @return object
     * @public
     */
    createQuery(): Query;
}
