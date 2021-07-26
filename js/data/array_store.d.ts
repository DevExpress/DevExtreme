import Store, {
    StoreOptions,
} from './abstract_store';
import { Query } from './query';

/** @namespace DevExpress.data */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ArrayStoreOptions<TKey = any, TValue = any> extends StoreOptions<TKey, TValue> {
    /**
     * @docid
     * @public
     * @type Array<any>
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
