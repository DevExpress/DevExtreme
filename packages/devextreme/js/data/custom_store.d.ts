import { FilterDescriptor, GroupDescriptor, LoadOptions } from '../data';
import { LoadResult, GroupItem as CustomStoreGroupItem } from '../common/data/custom-store';
import { DxExtendedPromise, DxPromise } from '../core/utils/deferred';
import {
  Store as StoreBase,
  Options as StoreOptionsBase,
} from './store';

/**
 * @public
 * @deprecated Use GroupItem from common/data/custom-store instead
 */
export type GroupItem<TItem = any> = CustomStoreGroupItem<TItem>;

/**
 * @docid
 * @public
 * @type object
 * @deprecated Use LoadResult instead
 */
export type ResolvedData<TItem = any> = LoadResult<TItem>;

type LoadFunctionResult<T> = T | DxPromise<T> | PromiseLike<T>;

/**
 * @docid
 * @public
 * @namespace DevExpress.data
 */
export interface CustomStoreOptions<
    TItem = any,
    TKey = any,
> extends StoreOptionsBase<TItem, TKey> {
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
     * @type_function_return LoadResult|Promise<LoadResult>
     * @public
     */
    load: (options: LoadOptions<TItem>) => LoadFunctionResult<LoadResult<TItem>>;
    /**
     * @docid
     * @default 'processed'
     * @public
     */
    loadMode?: 'processed' | 'raw';
    /**
     * @docid
     * @type_function_param1 result:LoadResult
     * @type_function_param2 loadOptions:LoadOptions
     * @action
     * @public
     */
    onLoaded?: ((result: LoadResult<TItem>, loadOptions: LoadOptions<TItem>) => void);
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
    useDefaultSearch?: boolean | undefined;
}
/**
 * @docid
 * @inherits Store
 * @public
 * @options CustomStoreOptions
 */
export class CustomStore<
    TItem = any,
    TKey = any,
> extends StoreBase<TItem, TKey> {
    constructor(options?: CustomStoreOptions<TItem, TKey>);
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
    load(): DxExtendedPromise<LoadResult<TItem>>;
    /**
     * @docid
     * @publicName load(options)
     * @param1 options:LoadOptions
     * @return Promise<LoadResult>
     * @public
     */
    load(options: LoadOptions<TItem>): DxExtendedPromise<LoadResult<TItem>>;
}

/**
 * @deprecated Use CustomStoreOptions from /common/data instead
 * @namespace DevExpress.data.CustomStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = CustomStoreOptions<TItem, TKey>;

/**
 * @deprecated Use CustomStore from /common/data instead
 */
export default CustomStore;
