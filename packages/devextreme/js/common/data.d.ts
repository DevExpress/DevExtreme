/* eslint-disable max-classes-per-file */
import { DxExtendedPromise, DxPromise } from '../core/utils/deferred';
import AbstractStore, { AbstractStoreOptions } from '../data/abstract_store';

import type {
    Store as StoreBase,
    StoreOptions as StoreOptionsBase,
} from '../data/store';

import type {
    SearchOperation as SearchOperationInternal,
    GroupingInterval as GroupingIntervalInternal,
    SortDescriptor as SortDescriptorInternal,
    GroupDescriptor as GroupDescriptorInternal,
    SelectDescriptor as SelectDescriptorInternal,
    FilterDescriptor as FilterDescriptorInternal,
    SummaryDescriptor as SummaryDescriptorInternal,
    LoadOptions as LoadOptionsInternal,
} from './data.types';

/**
 * @namespace DevExpress.common.data
 * @public
 */
export type SearchOperation = SearchOperationInternal;

/**
 * @namespace DevExpress.common.data
 * @public
 */
export type GroupingInterval = GroupingIntervalInternal;

/**
 * @docid
 * @public
 * @type object
 * @skip
 * @namespace DevExpress.common.data
 */
export type SortDescriptor<T> = SortDescriptorInternal<T>;

/**
 * @docid
 * @public
 * @type object
 * @skip
 * @namespace DevExpress.common.data
 */
export type GroupDescriptor<T> = GroupDescriptorInternal<T>;

/**
 * @docid
 * @public
 * @type object
 * @skip
 * @namespace DevExpress.common.data
 */
export type SelectDescriptor<T> = SelectDescriptorInternal<T>;

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common.data
 */
export type FilterDescriptor = FilterDescriptorInternal;

/**
 * @public
 * @docid
 * @type object
 * @namespace DevExpress.common.data
 */
export type LoadOptions<T = any> = LoadOptionsInternal<T>;

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common.data
 */
export type SummaryDescriptor<T> = SummaryDescriptorInternal<T>;

/**
 * @docid Utils.applyChanges
 * @publicName applyChanges(data, changes, options)
 * @param3 options?:any
 * @namespace DevExpress.common.data
 * @public
 */
export function applyChanges(data: Array<any>, changes: Array<any>, options?: { keyExpr?: string | Array<string>; immutable?: boolean }): Array<any>;

/**
 * @docid
 * @namespace DevExpress.common.data
 * @public
 * @type object
 * @inherits StoreOptions
 */
export type ArrayStoreOptions<
    TItem = any,
    TKey = any,
> = AbstractStoreOptions<TItem, TKey> & {
    /**
     * @docid
     * @public
     */
    data?: Array<TItem>;
};

/**
 * @docid
 * @namespace DevExpress.common.data
 * @public
 * @options ArrayStoreOptions
 */
export class ArrayStore<
    TItem = any,
    TKey = any,
> extends AbstractStore<TItem, TKey> {
    constructor(options?: ArrayStoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey): DxPromise<TItem>;
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
    createQuery(): Query;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export type GroupItem<
    TItem = any,
> = {
  /** @docid */
  key: any | string | number;
  /**
   * @docid
   * @type Array<any>|Array<GroupItem>|null
   */
  items: Array<TItem> | Array<GroupItem<TItem>> | null;
  /** @docid */
  count?: number;
  /** @docid */
  summary?: Array<any>;
};

type LoadResultArray<TItem = any> = Array<TItem> | Array<GroupItem<TItem>>;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export type LoadResultObject<TItem = any> = {
    /**
     * @docid
     * @type Array<any>|Array<GroupItem>
    */
    data: Array<TItem> | Array<GroupItem<TItem>>;
    /** @docid */
    totalCount?: number;
    /** @docid */
    summary?: Array<any>;
    /** @docid */
    groupCount?: number;
  };

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common.data
 */
export type LoadResult<
    TItem = any,
> =
  | Object
  | LoadResultArray<TItem>
  | LoadResultObject<TItem>;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export function isLoadResultObject<TItem>(res: LoadResult<TItem>): res is LoadResultObject<TItem>;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export function isGroupItemsArray<TItem>(res: LoadResult<TItem>): res is Array<GroupItem<TItem>>;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export function isItemsArray<TItem>(res: LoadResult<TItem>): res is Array<TItem>;

type LoadFunctionResult<T> = T | DxPromise<T> | PromiseLike<T>;

/**
 * @docid
 * @public
 * @type object
 * @deprecated Use LoadResult instead
 * @namespace DevExpress.common.data
 */
export type ResolvedData<TItem = any> = LoadResult<TItem>;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 * @type object
 */
export type CustomStoreOptions<
    TItem = any,
    TKey = any,
> = StoreOptionsBase<TItem, TKey> & {
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
};

/**
 * @docid
 * @inherits Store
 * @public
 * @options CustomStoreOptions
 * @namespace DevExpress.common.data
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

type DataSourceEventName = 'changed' | 'loadError' | 'loadingChanged';

/**
 * @namespace DevExpress.common.data
 * @docid
 * @public
 * @type object
 */
export type DataSourceOptions<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
    TKey = any,
> = {
    /**
     * @docid
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid
     * @public
     */
    expand?: Array<string> | string;
    /**
     * @docid
     * @type Filter expression
     * @public
     */
    filter?: FilterDescriptor | Array<FilterDescriptor>;
    /**
     * @docid
     * @type Group expression
     * @public
     */
    group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>;
    /**
     * @docid
     * @public
     */
    // eslint-disable-next-line spellcheck/spell-checker
    langParams?: LangParams;
    /**
     * @docid
     * @type_function_param1 dataItem:object
     * @type_function_return object
     * @public
     */
    map?: ((dataItem: TStoreItem) => TMappedItem);
    /**
     * @docid
     * @type_function_param1_field changes:Array<any>
     * @action
     * @public
     */
    onChanged?: ((e: { readonly changes?: Array<TMappedItem> }) => void);
    /**
     * @docid
     * @action
     * @public
     */
    onLoadError?: ((error: { readonly message?: string }) => void);
    /**
     * @docid
     * @action
     * @public
     */
    onLoadingChanged?: ((isLoading: boolean) => void);
    /**
     * @docid
     * @default 20
     * @public
     */
    pageSize?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    paginate?: boolean | undefined;
    /**
     * @docid
     * @type_function_param1 data:Array<any>
     * @type_function_return Array<any>
     * @public
     */
    postProcess?: ((data: Array<TMappedItem>) => Array<TItem>);
    /**
     * @docid
     * @default undefined
     * @public
     */
    pushAggregationTimeout?: number | undefined;
    /**
     * @docid
     * @public
     */
    requireTotalCount?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    reshapeOnPush?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @default "contains"
     * @public
     */
    searchOperation?: SearchOperation;
    /**
     * @docid
     * @default null
     * @public
     */
    searchValue?: any;
    /**
     * @docid
     * @type Select expression
     * @public
     */
    select?: SelectDescriptor<TItem>;
    /**
     * @docid
     * @type Sort expression
     * @public
     */
    sort?: SortDescriptor<TItem> | Array<SortDescriptor<TItem>>;
    /**
     * @docid
     * @public
     * @type Store|StoreOptions|Array<any>
     */
    store?: Array<TStoreItem> | Store<TStoreItem, TKey> | StoreOptions<TStoreItem, TKey>;
};

/**
 * @docid
 * @public
 * @options DataSourceOptions
 * @namespace DevExpress.common.data
 */
export class DataSource<
    TItem = any,
    TKey = any,
> {
    constructor(data: Array<TItem>);
    constructor(options: CustomStoreOptions<TItem, TKey> | DataSourceOptions<any, any, TItem, TKey>);
    constructor(store: Store<TItem, TKey>);
    constructor(url: string);
    /**
     * @docid
     * @publicName cancel(operationId)
     * @public
     */
    cancel(operationId: number): boolean;
    /**
     * @docid
     * @publicName dispose()
     * @public
     */
    dispose(): void;
    /**
     * @docid
     * @publicName filter()
     * @return object
     * @public
     */
    filter(): FilterDescriptor | Array<FilterDescriptor>;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @param1 filterExpr:object
     * @public
     */
    filter(filterExpr: FilterDescriptor | Array<FilterDescriptor>): void;
    /**
     * @docid
     * @publicName group()
     * @return object
     * @public
     */
    group(): GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>;
    /**
     * @docid
     * @publicName group(groupExpr)
     * @param1 groupExpr:object
     * @public
     */
    group(groupExpr: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>): void;
    /**
     * @docid
     * @publicName isLastPage()
     * @public
     */
    isLastPage(): boolean;
    /**
     * @docid
     * @publicName isLoaded()
     * @public
     */
    isLoaded(): boolean;
    /**
     * @docid
     * @publicName isLoading()
     * @public
     */
    isLoading(): boolean;
    /**
     * @docid
     * @publicName items()
     * @public
     */
    items(): Array<any>;
    /**
     * @docid
     * @publicName key()
     * @public
     */
    key(): string | Array<string>;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @public
     */
    load(): DxExtendedPromise<any>;
    /**
     * @docid
     * @publicName loadOptions()
     * @return object
     * @public
     */
    loadOptions(): LoadOptions<TItem>;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: DataSourceEventName): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: DataSourceEventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    on(eventName: DataSourceEventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: { [key in DataSourceEventName]?: Function }): this;
    /**
     * @docid
     * @publicName pageIndex()
     * @return numeric
     * @public
     */
    pageIndex(): number;
    /**
     * @docid
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @public
     */
    pageIndex(newIndex: number): void;
    /**
     * @docid
     * @publicName pageSize()
     * @return numeric
     * @public
     */
    pageSize(): number;
    /**
     * @docid
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid
     * @publicName paginate()
     * @public
     */
    paginate(): boolean;
    /**
     * @docid
     * @publicName paginate(value)
     * @public
     */
    paginate(value: boolean): void;
    /**
     * @docid
     * @publicName reload()
     * @return Promise<any>
     * @public
     */
    reload(): DxExtendedPromise<any>;
    /**
     * @docid
     * @publicName requireTotalCount()
     * @public
     */
    requireTotalCount(): boolean;
    /**
     * @docid
     * @publicName requireTotalCount(value)
     * @public
     */
    requireTotalCount(value: boolean): void;
    /**
     * @docid
     * @publicName searchExpr()
     * @return getter|Array<getter>
     * @public
     */
    searchExpr(): string & Function & Array<string | Function>;
    /**
     * @docid
     * @publicName searchExpr(expr)
     * @param1 expr:getter|Array<getter>
     * @public
     */
    searchExpr(expr: string | Function | Array<string | Function>): void;
    /**
     * @docid
     * @publicName searchOperation()
     * @public
     */
    searchOperation(): string;
    /**
     * @docid
     * @publicName searchOperation(op)
     * @public
     */
    searchOperation(op: string): void;
    /**
     * @docid
     * @publicName searchValue()
     * @public
     */
    searchValue(): any;
    /**
     * @docid
     * @publicName searchValue(value)
     * @public
     */
    searchValue(value: any): void;
    /**
     * @docid
     * @publicName select()
     * @return any
     * @public
     */
    select(): SelectDescriptor<TItem>;
    /**
     * @docid
     * @publicName select(expr)
     * @param1 expr:any
     * @public
     */
    select(expr: SelectDescriptor<TItem>): void;
    /**
     * @docid
     * @publicName sort()
     * @return any
     * @public
     */
    sort(): SortDescriptor<TItem> | Array<SortDescriptor<TItem>>;
    /**
     * @docid
     * @publicName sort(sortExpr)
     * @param1 sortExpr:any
     * @public
     */
    sort(sortExpr: SortDescriptor<TItem> | Array<SortDescriptor<TItem>>): void;
    /**
     * @docid
     * @publicName store()
     * @return object
     * @public
     */
    store(): Store<TItem, TKey>;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @public
     */
    totalCount(): number;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export type LangParams = {
  /**
   * @docid
   * @public
   */
  locale: string;
  /**
   * @docid
   * @public
   * @type object
   */
  collatorOptions?: Intl.CollatorOptions;
};

/**
* @public
* @namespace DevExpress.data.utils
*/
export type Store<TItem = any, TKey = any> =
  CustomStore<TItem, TKey> |
  ArrayStore<TItem, TKey> |
  LocalStore<TItem, TKey> |
  ODataStore<TItem, TKey>;

/**
* @public
* @namespace DevExpress.data.utils
* @type object
*/
export type StoreOptions<TItem = any, TKey = any> =
  CustomStoreOptions<TItem, TKey> |
  ArrayStoreOptions<TItem, TKey> & { type: 'array' } |
  LocalStoreOptions<TItem, TKey> & { type: 'local' } |
  ODataStoreOptions<TItem, TKey> & { type: 'odata' };

/**
 * @docid
 * @namespace DevExpress.common.data
 * @public
 */
export class EndpointSelector {
  constructor(options: any);
  /**
   * @docid
   * @publicName urlFor(key)
   * @public
   */
  urlFor(key: string): string;
}

/**
 * @docid Utils.errorHandler
 * @type function(e)
 * @namespace DevExpress.common.data
 * @deprecated Utils.setErrorHandler
 * @public
 */
export function errorHandler(e: Error): void;

/**
 * @docid Utils.setErrorHandler
 * @type function(handler)
 * @namespace DevExpress.common.data
 * @public
 */
export function setErrorHandler(handler: (e: Error) => void): void;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 */
export type LocalStoreOptions<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey> & {
    /**
     * @docid
     * @default 10000
     * @public
     */
    flushInterval?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    immediate?: boolean;
    /**
     * @docid
     * @public
     */
    name?: string;
};

/**
 * @docid
 * @inherits ArrayStore
 * @public
 * @options LocalStoreOptions
 * @namespace DevExpress.common.data
 */
export class LocalStore<
    TItem = any,
    TKey = any,
> extends ArrayStore<TItem, TKey> {
    constructor(options?: LocalStoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
}

/**
 * @docid
 * @type object
 * @public
 * @namespace DevExpress.common.data
 */
export type Query = {
    /**
     * @docid
     * @publicName aggregate(seed, step, finalize)
     * @param1 seed:object
     * @return Promise<any>
     * @public
     */
    aggregate(seed: any, step: Function, finalize: Function): DxPromise<any>;
    /**
     * @docid
     * @publicName aggregate(step)
     * @return Promise<any>
     * @public
     */
    aggregate(step: Function): DxPromise<any>;
    /**
     * @docid
     * @publicName avg()
     * @return Promise<number>
     * @public
     */
    avg(): DxPromise<number>;
    /**
     * @docid
     * @publicName avg(getter)
     * @param1 getter:object
     * @return Promise<number>
     * @public
     */
    avg(getter: any): DxPromise<number>;
    /**
     * @docid
     * @publicName count()
     * @return Promise<number>
     * @public
     */
    count(): DxPromise<number>;
    /**
     * @docid
     * @publicName enumerate()
     * @return Promise<any>
     * @public
     */
    enumerate(): DxPromise<any>;
    /**
     * @docid
     * @publicName filter(criteria)
     * @public
     */
    filter(criteria: Array<any>): Query;
    /**
     * @docid
     * @publicName filter(predicate)
     * @public
     */
    filter(predicate: Function): Query;
    /**
     * @docid
     * @publicName groupBy(getter)
     * @param1 getter:object
     * @public
     */
    groupBy(getter: any): Query;
    /**
     * @docid
     * @publicName max()
     * @return Promise<number,Date>
     * @public
     */
    max(): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName max(getter)
     * @param1 getter:object
     * @return Promise<number,Date>
     * @public
     */
    max(getter: any): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName min()
     * @return Promise<number,Date>
     * @public
     */
    min(): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName min(getter)
     * @param1 getter:object
     * @return Promise<number,Date>
     * @public
     */
    min(getter: any): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName select(getter)
     * @param1 getter:object|Array<getter>
     * @public
     */
    select(...getters: any[]): Query;
    /**
     * @docid
     * @publicName slice(skip, take)
     * @param2 take:number|undefined
     * @public
     */
    slice(skip: number, take?: number): Query;
    /**
     * @docid
     * @publicName sortBy(getter)
     * @param1 getter:object
     * @public
     */
    sortBy(getter: any): Query;
    /**
     * @docid
     * @publicName sortBy(getter, desc)
     * @param1 getter:object
     * @public
     */
    sortBy(getter: any, desc: boolean): Query;
    /**
     * @docid
     * @publicName sum()
     * @return Promise<number>
     * @public
     */
    sum(): DxPromise<number>;
    /**
     * @docid
     * @publicName sum(getter)
     * @param1 getter:object
     * @return Promise<number>
     * @public
     */
    sum(getter: any): DxPromise<number>;
    /**
     * @docid
     * @publicName thenBy(getter)
     * @param1 getter:object
     * @public
     */
    thenBy(getter: any): Query;
    /**
     * @docid
     * @publicName thenBy(getter, desc)
     * @param1 getter:object
     * @public
     */
    thenBy(getter: any, desc: boolean): Query;
    /**
     * @docid
     * @publicName toArray()
     * @public
     */
    toArray(): Array<any>;
};

/**
 * @docid Utils.query
 * @publicName query(array, queryOptions)
 * @param2 queryOptions:object
 * @namespace DevExpress.common.data
 * @public
 */
export function query(array: Array<any>, queryOptions?: any): Query;

/**
 * @docid Utils.query
 * @publicName query(url, queryOptions)
 * @param2 queryOptions:object
 * @namespace DevExpress.common.data
 * @public
 */
export function query(url: string, queryOptions: any): Query;

/**
 * @docid Utils.base64_encode
 * @publicName base64_encode(input)
 * @namespace DevExpress.common.data
 * @public
 */
export function base64_encode(input: string | Array<number>): string;

/**
 * @docid Utils.compileGetter
 * @publicName compileGetter(expr)
 * @namespace DevExpress.common.data
 * @public
 */
export function compileGetter(expr: string | Array<string>): Function;

/**
 * @docid Utils.compileSetter
 * @publicName compileSetter(expr)
 * @namespace DevExpress.common.data
 * @public
 */
export function compileSetter(expr: string | Array<string>): Function;

export interface ODataRequestOptions {
    accepts: any;
    async: boolean;
    contentType: string | boolean;
    data: any;
    dataType: string;
    headers: any;
    jsonp?: boolean;
    method: string;
    timeout: number;
    url: string;
    xhrFields: any;
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'MERGE';

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 * @type object
 */
export type ODataContextOptions = {
    /**
     * @docid
     * @type_function_param1_field params:object
     * @type_function_param1_field payload:object
     * @type_function_param1_field headers:object
     * @public
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * @docid
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid
     * @public
     */
    entities?: any;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field errorDetails:object
     * @type_function_param1_field requestOptions:object
     * @public
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * @docid
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid
     * @public
     */
    url?: string;
    /**
     * @docid
     * @default 4
     * @acceptValues 2|3|4
     * @public
     */
    version?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    withCredentials?: boolean;
};

/**
 * @docid
 * @public
 * @options ODataContextOptions
 * @namespace DevExpress.common.data
 */
export class ODataContext {
    constructor(options?: ODataContextOptions);
    /**
     * @docid
     * @publicName get(operationName, params)
     * @param2 params:object
     * @return Promise<any>
     * @public
     */
    get(operationName: string, params: any): DxPromise<any>;
    /**
     * @docid
     * @publicName invoke(operationName, params, httpMethod)
     * @param2 params:object
     * @param3 httpMethod:string
     * @return Promise<void>
     * @public
     */
    invoke(operationName: string, params: any, httpMethod: HttpMethod): DxPromise<void>;
    /**
     * @docid
     * @publicName objectLink(entityAlias, key)
     * @param2 key:object|string|number
     * @return object
     * @public
     */
    objectLink(entityAlias: string, key: any | string | number): any;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.data
 * @type object
 */
export type ODataStoreOptions<
    TItem = any,
    TKey = any,
> = AbstractStoreOptions<TItem, TKey> & {
    /**
     * @docid
     * @type_function_param1_field params:object
     * @type_function_param1_field payload:object
     * @type_function_param1_field headers:object
     * @public
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * @docid
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field errorDetails:object
     * @type_function_param1_field requestOptions:object
     * @public
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * @docid
     * @default {}
     * @public
     */
    fieldTypes?: any;
    /**
     * @docid
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid
     * @type string|object
     * @acceptValues "String"|"Int32"|"Int64"|"Guid"|"Boolean"|"Single"|"Decimal"
     * @public
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * @docid
     * @public
     */
    url?: string;
    /**
     * @docid
     * @default 4
     * @acceptValues 2|3|4
     * @public
     */
    version?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    withCredentials?: boolean;
};

/**
 * @docid
 * @inherits Store
 * @public
 * @options ODataStoreOptions
 * @namespace DevExpress.common.data
 */
export class ODataStore<
    TItem = any,
    TKey = any,
> extends AbstractStore<TItem, TKey> {
    constructor(options?: ODataStoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName byKey(key, extraOptions)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey, extraOptions?: { expand?: string | Array<string>; select?: string | Array<string> }): DxPromise<TItem>;
    /**
     * @docid
     * @publicName createQuery(loadOptions)
     * @return object
     * @public
     */
    createQuery(loadOptions?: { expand?: string | Array<string>; requireTotalCount?: boolean; customQueryParams?: any }): Query;
}

/**
 * @docid
 * @namespace DevExpress.common.data
 * @public
 */
export class EdmLiteral {
    constructor(value: string);
    /**
     * @docid
     * @publicName valueOf()
     * @public
     */
    valueOf(): string;
}

/**
 * @const Utils.keyConverters
 * @publicName odata.keyConverters
 * @namespace DevExpress.common.data
 * @public
 */
// eslint-disable-next-line vars-on-top, import/no-mutable-exports, no-var, @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
export var keyConverters: any;
