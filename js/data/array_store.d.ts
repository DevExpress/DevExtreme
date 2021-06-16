import Store, {
    StoreOptions
} from './abstract_store';
import { Query } from './query';

/** @namespace DevExpress.data */
export interface ArrayStoreOptions<TKey = any, TValue = any> extends StoreOptions<TKey, TValue> {
    /**
     * @docid
     * @public
     */
    data?: Array<TValue>;
}
/**
 * @docid
 * @inherits Store
 * @module data/array_store
 * @export default
 * @public
 */
export default class ArrayStore<TKey = any, TValue = any> extends Store<TKey, TValue> {
    constructor(options?: ArrayStoreOptions<TKey, TValue>)
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
