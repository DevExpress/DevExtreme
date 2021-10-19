import { FilterDescriptor, GroupDescriptor, LoadOptions } from './index';
import Store, { Options as StoreOptions } from './abstract_store';

/** @public */
export type Options<
    TItem = any,
    TKey = any,
> = CustomStoreOptions<TItem, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface CustomStoreOptions<
    TItem = any,
    TKey = any,
> extends StoreOptions<TItem, TKey> {
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_return Promise<any>
     * @public
     */
    byKey?: ((key: TKey) => PromiseLike<TItem>);
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
    insert?: ((values: TItem) => PromiseLike<TItem>);
    /**
     * @docid
     * @type_function_param1 options:LoadOptions
     * @type_function_return Promise<any>|Array<any>
     * @public
     */
    load: ((options: LoadOptions<TItem>) => PromiseLike<TItem> | Array<TItem>);
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
    totalCount?: ((loadOptions: { filter?: FilterDescriptor | Array<FilterDescriptor>; group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>> }) => PromiseLike<number>);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @type_function_return Promise<any>
     * @public
     */
    update?: ((key: TKey, values: TItem) => PromiseLike<any>);
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
    TItem = any,
    TKey = any,
> extends Store<TItem, TKey> {
    constructor(options?: Options<TItem, TKey>)
    /**
     * @docid
     * @publicName clearRawDataCache()
     * @public
     */
    clearRawDataCache(): void;
}
