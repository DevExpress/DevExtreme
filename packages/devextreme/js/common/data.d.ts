/* eslint-disable max-classes-per-file */
import { DxPromise } from '../common';
import { DxExtendedPromise } from '../core/utils/deferred';
import { DeepPartial } from '../core/index';
import AbstractStore, { AbstractStoreOptions } from './data/abstract_store';

/**
 * @docid Utils.applyChanges
 * @publicName applyChanges(data, changes, options)
 * @param3 options?:any
 * @namespace DevExpress.data
 * @public
 */
export function applyChanges(data: Array<any>, changes: Array<any>, options?: { keyExpr?: string | Array<string>; immutable?: boolean }): Array<any>;

/**
 * @docid StoreOptions
 * @namespace DevExpress.data.Store
 * @hidden
 */
export type StoreOptionsBase<
    TItem = any,
    TKey = any,
> = {
    /**
     * @docid StoreOptions.errorHandler
     * @public
     */
    errorHandler?: Function;
    /**
     * @docid StoreOptions.key
     * @public
     */
    key?: string | Array<string>;
    /**
     * @docid StoreOptions.onInserted
     * @type_function_param1 values:object
     * @type_function_param2 key:object|string|number
     * @action
     * @public
     */
    onInserted?: ((values: TItem, key: TKey) => void);
    /**
     * @docid StoreOptions.onInserting
     * @type_function_param1 values:object
     * @action
     * @public
     */
    onInserting?: ((values: TItem) => void);
    /**
     * @docid StoreOptions.onLoading
     * @type_function_param1 loadOptions:LoadOptions
     * @action
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions<TItem>) => void);
    /**
     * @docid StoreOptions.onModified
     * @action
     * @public
     */
    onModified?: Function;
    /**
     * @docid StoreOptions.onModifying
     * @action
     * @public
     */
    onModifying?: Function;
    /**
     * @docid StoreOptions.onPush
     * @action
     * @public
     */
    onPush?: ((changes: Array<TItem>) => void);
    /**
     * @docid StoreOptions.onRemoved
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoved?: ((key: TKey) => void);
    /**
     * @docid StoreOptions.onRemoving
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoving?: ((key: TKey) => void);
    /**
     * @docid StoreOptions.onUpdated
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdated?: ((key: TKey, values: TItem) => void);
    /**
     * @docid StoreOptions.onUpdating
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdating?: ((key: TKey, values: TItem) => void);
};

type StoreBaseEventName = 'loaded' | 'loading' | 'inserted' | 'inserting' | 'updated' | 'updating' | 'push' | 'removed' | 'removing' | 'modified' | 'modifying';

/**
 * @docid Store
 * @namespace DevExpress.data
 * @hidden
 * @options StoreOptionsBase
 */
export class StoreBase<
    TItem = any,
    TKey = any,
> {
    constructor(options?: StoreOptionsBase<TItem, TKey>);
    /**
     * @docid
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @public
     */
    insert(values: TItem): DxExtendedPromise<TItem>;
    /**
     * @docid
     * @publicName key()
     * @public
     */
    key(): string | Array<string>;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any|string|number
     * @public
     */
    keyOf(obj: TItem): TKey;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: StoreBaseEventName): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: StoreBaseEventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    on(eventName: StoreBaseEventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: { [key in StoreBaseEventName]?: Function }): this;
    /**
     * @docid
     * @publicName push(changes)
     * @param1 changes:Array<any>
     * @public
     */
    push(changes: Array<{ type: 'insert' | 'update' | 'remove'; data?: DeepPartial<TItem>; key?: TKey; index?: number }>): void;
    /**
     * @docid
     * @publicName remove(key)
     * @param1 key:object|string|number
     * @return Promise<void>
     * @public
     */
    remove(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName totalCount(options)
     * @param1_field filter:object
     * @param1_field group:object
     * @return Promise<number>
     * @public
     */
    totalCount(obj: { filter?: FilterDescriptor | Array<FilterDescriptor>; group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>> }): DxPromise<number>;
    /**
     * @docid
     * @publicName update(key, values)
     * @param1 key:object|string|number
     * @param2 values:object
     * @return Promise<any>
     * @public
     */
    update(key: TKey, values: DeepPartial<TItem>): DxExtendedPromise<TItem>;
}

/**
 * @docid
 * @namespace DevExpress.data
 */
export interface ArrayStoreOptions<
    TItem = any,
    TKey = any,
> extends AbstractStoreOptions<TItem, TKey> {
    /**
     * @docid
     * @public
     */
    data?: Array<TItem>;
}

/**
 * @docid
 * @inherits Store
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
 */
export function isLoadResultObject<TItem>(res: LoadResult<TItem>): res is LoadResultObject<TItem>;

/**
 * @docid
 * @public
 */
export function isGroupItemsArray<TItem>(res: LoadResult<TItem>): res is Array<GroupItem<TItem>>;

/**
 * @docid
 * @public
 */
export function isItemsArray<TItem>(res: LoadResult<TItem>): res is Array<TItem>;

type LoadFunctionResult<T> = T | DxPromise<T> | PromiseLike<T>;

/**
 * @docid
 * @public
 * @type object
 * @deprecated Use LoadResult instead
 */
export type ResolvedData<TItem = any> = LoadResult<TItem>;

/**
 * @docid
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
    useDefaultSearch?: boolean;
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

type DataSourceEventName = 'changed' | 'loadError' | 'loadingChanged';

/**
 * @namespace DevExpress.data
 * @docid
 */
export interface DataSourceOptions<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
    TKey = any,
> {
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
    paginate?: boolean;
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
    pushAggregationTimeout?: number;
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
}

/**
 * @docid
 * @public
 * @options DataSourceOptions
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
 * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
 */
export type DataSourceLike<TItem, TKey = any> =
    string |
    Array<TItem> |
    Store<TItem, TKey> |
    DataSourceOptionsStub<any, any, TItem> |
    DataSource<TItem, TKey>;

interface DataSourceOptionsStub<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
> {
    customQueryParams?: any;
    expand?: Array<string> | string;
    filter?: FilterDescriptor | Array<FilterDescriptor>;
    group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>;
    map?: ((dataItem: TStoreItem) => TMappedItem);
    onChanged?: ((e: { readonly changes?: Array<TMappedItem> }) => void);
    onLoadError?: ((error: { readonly message?: string }) => void);
    onLoadingChanged?: ((isLoading: boolean) => void);
    pageSize?: number;
    paginate?: boolean;
    postProcess?: ((data: Array<TMappedItem>) => Array<TItem>);
    pushAggregationTimeout?: number;
    requireTotalCount?: boolean;
    reshapeOnPush?: boolean;
    searchExpr?: string | Function | Array<string | Function>;
    searchOperation?: SearchOperation;
    searchValue?: any;
    select?: SelectDescriptor<TItem>;
    sort?: SortDescriptor<TItem> | Array<SortDescriptor<TItem>>;
    store?: Array<TStoreItem> | Store<TStoreItem, any> | StoreOptions<TStoreItem, any>;
}

/**
 * @public
 */
export type SearchOperation = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'startswith' | 'endswith' | 'contains' | 'notcontains';

/**
 * @public
 */
export type GroupingInterval = 'year' | 'quarter' | 'month' | 'day' | 'dayOfWeek' | 'hour' | 'minute' | 'second';

type KeySelector<T> = string | ((source: T) => string | number | Date | Object);

type SelectionDescriptor<T> = {
    selector: KeySelector<T>;
};

type OrderingDescriptor<T> = SelectionDescriptor<T> & {
    desc?: boolean;
};

/**
 * @docid
 * @public
 * @type object
 * @skip
 */
export type SortDescriptor<T> = KeySelector<T> | OrderingDescriptor<T>;

/**
 * @docid
 * @public
 * @type object
 * @skip
 */
export type GroupDescriptor<T> = KeySelector<T> | (OrderingDescriptor<T> & {
  groupInterval?: number | GroupingInterval;
  isExpanded?: boolean;
});

/**
 * @docid
 * @public
 * @type object
 * @skip
 */
export type SelectDescriptor<T> = string | Array<string> | ((source: T) => any);
/**
 * @docid
 * @public
 */
export type FilterDescriptor = any;
/**
 * @docid
 * @public
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
 * @docid
 * @public
 * @type object
 */
 export type SummaryDescriptor<T> = KeySelector<T> | SelectionDescriptor<T> & {
  summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
};

/**
 * @public
 * @docid
 * @namespace DevExpress.data
 * @type object
 */
export interface LoadOptions<T = any> {
  /**
   * @docid
   * @public
   */
  customQueryParams?: any;
  /**
   * @docid
   * @public
   */
  startDate?: Date;
  /**
   * @docid
   * @public
   */
  endDate?: Date;
  /**
   * @docid
   * @public
   */
  expand?: Array<string>;
  /**
   * @docid
   * @public
   * @type object
   */
  filter?: FilterDescriptor | Array<FilterDescriptor>;
  /**
   * @docid
   * @public
   * @type object
   */
  group?: GroupDescriptor<T> | Array<GroupDescriptor<T>>;
  /**
   * @docid
   * @public
   * @type SummaryDescriptor | Array<SummaryDescriptor>
   */
  groupSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
  /**
   * @docid
   * @public
   */
  parentIds?: Array<any>;
  /**
   * @docid
   * @public
   */
  requireGroupCount?: boolean;
  /**
   * @docid
   * @public
   */
  requireTotalCount?: boolean;
  /**
   * @docid
   * @type getter|Array<getter>
   * @public
   */
  searchExpr?: string | Function | Array<string | Function>;
  /**
   * @docid
   * @public
   */
  searchOperation?: SearchOperation;
  /**
   * @docid
   * @public
   */
  searchValue?: any;
  /**
   * @docid
   * @public
   * @type object
   */
  select?: SelectDescriptor<T>;
  /**
   * @docid
   * @public
   */
  skip?: number;
  /**
   * @docid
   * @public
   * @type object
   */
  sort?: SortDescriptor<T> | Array<SortDescriptor<T>>;
  /**
   * @docid
   * @public
   */
  take?: number;
  /**
   * @docid
   * @public
   * @type SummaryDescriptor | Array<SummaryDescriptor>
   */
  totalSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
  /**
   * @docid
   * @public
   */
  userData?: any;
}

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
 * @namespace DevExpress
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
 * @namespace DevExpress.data
 * @deprecated Utils.setErrorHandler
 * @public
 */
export function errorHandler(e: Error): void;

/**
 * @docid Utils.setErrorHandler
 * @type function(handler)
 * @namespace DevExpress.data
 * @public
 */
export function setErrorHandler(handler: (e: Error) => void): void;

/**
 * @docid
 * @namespace DevExpress.data
 */
export interface LocalStoreOptions<
    TItem = any,
    TKey = any,
> extends ArrayStoreOptions<TItem, TKey> {
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
}

/**
 * @docid
 * @inherits ArrayStore
 * @public
 * @options LocalStoreOptions
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
 */
export interface Query {
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
}

/**
 * @docid Utils.query
 * @publicName query(array, queryOptions)
 * @param2 queryOptions:object
 * @namespace DevExpress.data
 * @public
 */
export function query(array: Array<any>, queryOptions?: any): Query;

/**
 * @docid Utils.query
 * @publicName query(url, queryOptions)
 * @param2 queryOptions:object
 * @namespace DevExpress.data
 * @public
 */
export function query(url: string, queryOptions: any): Query;

/**
 * @docid Utils.base64_encode
 * @publicName base64_encode(input)
 * @namespace DevExpress.data
 * @public
 */
export function base64_encode(input: string | Array<number>): string;

/**
 * @docid Utils.compileGetter
 * @publicName compileGetter(expr)
 * @namespace DevExpress.data.utils
 * @public
 */
export function compileGetter(expr: string | Array<string>): Function;

/**
 * @docid Utils.compileSetter
 * @publicName compileSetter(expr)
 * @namespace DevExpress.data.utils
 * @public
 */
export function compileSetter(expr: string | Array<string>): Function;

/**
 * @docid
 * @hidden
 */
export class DataHelperMixin {
    /**
     * @docid
     * @publicName getDataSource()
     * @public
     */
    getDataSource(): DataSource;
}

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
 * @namespace DevExpress.data
 * @type object
 */
export interface ODataContextOptions {
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
}
/**
 * @docid
 * @public
 * @options ODataContextOptions
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
 * @namespace DevExpress.data
 */
export interface ODataStoreOptions<
    TItem = any,
    TKey = any,
> extends StoreOptionsBase<TItem, TKey> {
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
}

/**
 * @docid
 * @inherits Store
 * @public
 * @options ODataStoreOptions
 */
export class ODataStore<
    TItem = any,
    TKey = any,
> extends StoreBase<TItem, TKey> {
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
 * @namespace DevExpress.data
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
 * @namespace DevExpress.data.utils.odata
 * @public
 */
// eslint-disable-next-line vars-on-top, import/no-mutable-exports, no-var, @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
export var keyConverters: any;
