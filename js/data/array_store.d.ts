import Store, {
    StoreOptions
} from './abstract_store';

/** @namespace DevExpress.data */
export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
    /**
     * @docid
     * @public
     */
    data?: Array<any>;
}
/**
 * @docid
 * @inherits Store
 * @module data/array_store
 * @export default
 * @public
 */
export default class ArrayStore extends Store {
    constructor(options?: ArrayStoreOptions)
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
    createQuery(): any;
}
