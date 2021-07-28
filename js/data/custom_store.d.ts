import { FilterDescriptor, GroupDescriptor, LoadOptions } from './index';
import Store, { StoreOptions } from './abstract_store';

/** @namespace DevExpress.data */
export interface CustomStoreOptions<TKey = any, TValue = any> extends StoreOptions<TKey, TValue> {
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_return Promise<any>
     * @public
     */
    byKey?: ((key: TKey) => PromiseLike<TValue>);
    /**
     * @docid
     * @default true
     * @public
     */
    cacheRawData?: boolean;
    /**
     * @docid
     * @type_function_param1 values:object
     * @type_function_return Promise<any>
     * @public
     */
    insert?: ((values: TValue) => PromiseLike<TValue>);
    /**
     * @docid
     * @type_function_param1 options:LoadOptions
     * @type_function_return Promise<any>|Array<any>
     * @public
     */
    load?: ((options: LoadOptions<TValue>) => PromiseLike<TValue> | Array<TValue>);
    /**
     * @docid
     * @type string
     * @default 'processed'
     * @acceptValues 'processed'|'raw'
     * @public
     */
    loadMode?: 'processed' | 'raw';
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_return Promise<void>
     * @public
     */
    remove?: ((key: TKey) => PromiseLike<void>);
    /**
     * @docid
     * @type_function_param1 loadOptions:object
     * @type_function_param1_field1 filter:object
     * @type_function_param1_field2 group:object
     * @type_function_return Promise<number>
     * @public
     */
    totalCount?: ((loadOptions: { filter?: FilterDescriptor | Array<FilterDescriptor>, group?: GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>> }) => PromiseLike<number>);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @type_function_return Promise<any>
     * @public
     */
    update?: ((key: TKey, values: TValue) => PromiseLike<any>);
    /**
     * @docid
     * @default undefined
     * @public
     */
    useDefaultSearch?: boolean;
}
/**
 * @docid
 * @inherits Store
 * @module data/custom_store
 * @export default
 * @public
 */
export default class CustomStore<TKey = any, TValue = any> extends Store<TKey, TValue> {
    constructor(options?: CustomStoreOptions<TKey, TValue>)
    /**
     * @docid
     * @publicName clearRawDataCache()
     * @public
     */
    clearRawDataCache(): void;
}
