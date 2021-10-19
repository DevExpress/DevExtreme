import { FilterDescriptor, GroupDescriptor, LoadOptions } from './index';
import Store, { Options as StoreOptions } from './abstract_store';

/** @public */
export type Options<
    TValue = any,
    TKey = any,
> = CustomStoreOptions<TValue, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface CustomStoreOptions<
    TValue = any,
    TKey = any,
> extends StoreOptions<TValue, TKey> {
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
    load: ((options: LoadOptions<TValue>) => PromiseLike<TValue> | Array<TValue>);
    /**
     * @docid
     * @default 'processed'
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
     * @type_function_param1_field1 filter:object
     * @type_function_param1_field2 group:object
     * @type_function_return Promise<number>
     * @public
     */
    totalCount?: ((loadOptions: { filter?: FilterDescriptor | Array<FilterDescriptor>; group?: GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>> }) => PromiseLike<number>);
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
 * @public
 */
export default class CustomStore<
    TValue = any,
    TKey = any,
> extends Store<TValue, TKey> {
    constructor(options?: Options<TValue, TKey>)
    /**
     * @docid
     * @publicName clearRawDataCache()
     * @public
     */
    clearRawDataCache(): void;
}
