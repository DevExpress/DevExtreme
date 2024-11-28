import { DxPromise } from '../core/utils/deferred';
import AbstractStore, { AbstractStoreOptions } from './abstract_store';
import { Query } from './query';

/**
 * @docid
 * @public
 * @namespace DevExpress.data
 */
export interface ArrayStoreOptions<
    TItem = any,
    TKey = any,
> extends AbstractStoreOptions<TItem, TKey> {
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
> extends AbstractStore<TItem, TKey> {
    constructor(options?: ArrayStoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey): DxPromise<TItem>;
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

/**
 * @deprecated Use ArrayStoreOptions from /common/data instead
 * @namespace DevExpress.data.ArrayStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey>;
