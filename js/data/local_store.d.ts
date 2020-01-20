import ArrayStore, {
    ArrayStoreOptions
} from './array_store';

export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
    /**
     * @docid LocalStoreOptions.flushInterval
     * @type number
     * @default 10000
     * @prevFileNamespace DevExpress.data
     * @public
     */
    flushInterval?: number;
    /**
     * @docid LocalStoreOptions.immediate
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    immediate?: boolean;
    /**
     * @docid LocalStoreOptions.name
     * @type string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    name?: string;
}
/**
 * @docid LocalStore
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
     * @docid LocalStoreMethods.clear
     * @publicName clear()
     * @prevFileNamespace DevExpress.data
     * @public
     */
    clear(): void;
}
