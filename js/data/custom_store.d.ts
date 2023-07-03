import { FilterDescriptor, GroupDescriptor, LoadOptions } from './index';
import { Options as StoreOptions, Store } from './abstract_store';
import { DxExtendedPromise, DxPromise } from '../core/utils/deferred';
import { CustomStoreLoadResult } from '../common/data';

export type { CustomStoreLoadResult as ResolvedData, CustomStoreGroupItem as GroupItem } from '../common/data';

/** @public */
export type Options<
    TItem = any,
    TKey = any,
> = CustomStoreOptions<TItem, TKey>;

type LoadResult<T> = T | DxPromise<T> | PromiseLike<T>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 * @docid
 */
export interface CustomStoreOptions<
    TItem = any,
    TKey = any,
> extends StoreOptions<TItem, TKey> {
    /**
     * @docid
     * @public
     * @type_function_param1 key:object|string|number
     * @type_function_param2 extraOptions:LoadOptions
     * @type_function_return Promise<any>
     */
    byKey?: ((key: TKey, extraOptions?: LoadOptions<TItem>) => PromiseLike<TItem>);
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
     * @type_function_return Promise<Array<any>|object>|Array<any>
     * @public
     */
    load: (options: LoadOptions<TItem>) => LoadResult<CustomStoreLoadResult<TItem>>;
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
     * @type_function_param1_field filter:object
     * @type_function_param1_field group:object
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
 * @options CustomStoreOptions
 */
export default class CustomStore<
    TItem = any,
    TKey = any,
> extends Store<TItem, TKey> {
    constructor(options?: Options<TItem, TKey>);
    /**
     * @docid
     * @publicName byKey(key, extraOptions)
     * @param1 key:object|string|number
     * @param2 extraOptions:LoadOptions
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey, extraOptions?: LoadOptions<TItem>): DxPromise<TItem>;
    /**
     * @docid
     * @publicName clearRawDataCache()
     * @public
     */
    clearRawDataCache(): void;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @public
     */
    load(): DxExtendedPromise<CustomStoreLoadResult<TItem>>;
    /**
     * @docid
     * @publicName load(options)
     * @param1 options:LoadOptions
     * @return Promise<any>
     * @public
     */
    load(options: LoadOptions<TItem>): DxExtendedPromise<CustomStoreLoadResult<TItem>>;
}
