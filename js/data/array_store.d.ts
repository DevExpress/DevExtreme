import Store, {
    Options as StoreOptions,
} from './abstract_store';

/** @namespace DevExpress.data */
export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions { // eslint-disable-line @typescript-eslint/no-unused-vars
    /**
     * @docid
     * @public
     */
    data?: Array<any>;
}
/**
 * @docid
 * @inherits Store
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
