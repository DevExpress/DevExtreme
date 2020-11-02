import ArrayStore, {
    ArrayStoreOptions
} from './array_store';

export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
    /**
     * @docid
     * @type number
     * @default 10000
     * @prevFileNamespace DevExpress.data
     * @public
     */
    flushInterval?: number;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    immediate?: boolean;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @inherits ArrayStore
 * @type object
 * @module data/local_store
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class LocalStore extends ArrayStore {
    constructor(options?: LocalStoreOptions)
    /**
     * @docid
     * @publicName clear()
     * @prevFileNamespace DevExpress.data
     * @public
     */
    clear(): void;
}
