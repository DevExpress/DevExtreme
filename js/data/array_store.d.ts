import Store, {
    StoreOptions
} from './abstract_store';

export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
    /**
     * @docid
     * @type Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    data?: Array<any>;
}
/**
 * @docid
 * @inherits Store
 * @type object
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
