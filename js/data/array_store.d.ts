import Store, {
    StoreOptions
} from './abstract_store';

/** @namespace DevExpress.data */
export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    data?: Array<any>;
}
/**
 * @docid
 * @inherits Store
 * @module data/array_store
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class ArrayStore extends Store {
    constructor(options?: ArrayStoreOptions)
    /**
     * @docid
     * @publicName clear()
     * @prevFileNamespace DevExpress.data
     * @public
     */
    clear(): void;
    /**
     * @docid
     * @publicName createQuery()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    createQuery(): any;
}
