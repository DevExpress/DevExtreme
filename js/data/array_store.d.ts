import Store, {
    Options as StoreOptions,
} from './abstract_store';
import { Query } from './query';

/** @public */
export type Options<
    TValue = any,
    TKey = any,
> = ArrayStoreOptions<TValue, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface ArrayStoreOptions<
    TValue = any,
    TKey = any,
> extends StoreOptions<TValue, TKey> {
    /**
     * @docid
     * @public
     */
    data?: Array<TValue>;
}
/**
 * @docid
 * @inherits Store
 * @public
 */
export default class ArrayStore<
    TValue = any,
    TKey = any,
> extends Store<TValue, TKey> {
    constructor(options?: Options<TValue, TKey>)
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
