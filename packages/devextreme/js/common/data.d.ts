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

export type SearchOperation = SearchOperationInternal;

export type GroupingInterval = GroupingIntervalInternal;

/**
 * 
 */
export type SortDescriptor<T> = SortDescriptorInternal<T>;

/**
 * 
 */
export type GroupDescriptor<T> = GroupDescriptorInternal<T>;

/**
 * 
 */
export type SelectDescriptor<T> = SelectDescriptorInternal<T>;

/**
 * 
 */
export type FilterDescriptor = FilterDescriptorInternal;

/**
 * This section describes the loadOptions object&apos;s fields.
 */
export type LoadOptions<T = any> = LoadOptionsInternal<T>;

/**
 * A total summary expression for `loadOptions`.
 */
export type SummaryDescriptor<T> = SummaryDescriptorInternal<T>;

/**
 * Applies an array of changes to a source data array.
 */
export function applyChanges(data: Array<any>, changes: Array<any>, options?: { keyExpr?: string | Array<string>; immutable?: boolean }): Array<any>;

/**
 * 
 */
export type ArrayStoreOptions<
    TItem = any,
    TKey = any,
> = AbstractStoreOptions<TItem, TKey> & {
    /**
     * Specifies the store&apos;s associated array.
     */
    data?: Array<TItem>;
};

/**
 * The ArrayStore is a store that provides an interface for loading and editing an in-memory array and handling related events.
 */
export class ArrayStore<
    TItem = any,
    TKey = any,
> extends AbstractStore<TItem, TKey> {
    constructor(options?: ArrayStoreOptions<TItem, TKey>);
    /**
     * Gets a data item with a specific key.
     */
    byKey(key: TKey): DxPromise<TItem>;
    /**
     * Clears all the ArrayStore&apos;s associated data.
     */
    clear(): void;
    /**
     * Creates a Query for the underlying array.
     */
    createQuery(): Query;
}

/**
 * An additional type for LoadResult.
 */
export type GroupItem<
    TItem = any,
> = {
  /**
   * A key to group items by.
   */
  key: any | string | number;
  /**
   * Contains an array of items or GroupItems, or nothing.
   */
  items: Array<TItem> | Array<GroupItem<TItem>> | null;
  /**
   * A total number of items.
   */
  count?: number;
  /**
   * A summary array that contains the resulting values in the same order as the summary definitions.
   */
  summary?: Array<any>;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type LoadResultArray<TItem = any> = Array<TItem> | Array<GroupItem<TItem>>;

/**
 * An additional type for LoadResult.
 */
export type LoadResultObject<TItem = any> = {
    /**
     * Contains an array of items or GroupItems.
     */
    data: Array<TItem> | Array<GroupItem<TItem>>;
    /**
     * A total number of items.
     */
    totalCount?: number;
    /**
     * A summary array that contains the resulting values in the same order as the summary definitions.
     */
    summary?: Array<any>;
    /**
     * A number of groups.
     */
    groupCount?: number;
  };

/**
 * Specifies returned data of the `load()` method in CustomStore.
 */
export type LoadResult<
    TItem = any,
> =
  | Object
  | LoadResultArray<TItem>
  | LoadResultObject<TItem>;

/**
 * A type guard function that checks whether LoadResult is a LoadResultObject.
 */
export function isLoadResultObject<TItem>(res: LoadResult<TItem>): res is LoadResultObject<TItem>;

/**
 * A type guard function that checks whether LoadResult is an array of GroupItems.
 */
export function isGroupItemsArray<TItem>(res: LoadResult<TItem>): res is Array<GroupItem<TItem>>;

/**
 * A type guard function that checks whether LoadResult is an array of items.
 */
export function isItemsArray<TItem>(res: LoadResult<TItem>): res is Array<TItem>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type LoadFunctionResult<T> = T | DxPromise<T> | PromiseLike<T>;

/**
 * Specifies returned data of the `load()` method in CustomStore.
 * @deprecated Use LoadResult instead.
 */
export type ResolvedData<TItem = any> = LoadResult<TItem>;

/**
 * 
 */
export type CustomStoreOptions<
    TItem = any,
    TKey = any,
> = StoreOptionsBase<TItem, TKey> & {
    /**
     * Specifies a custom implementation of the byKey(key) method.
     */
    byKey?: ((key: TKey, extraOptions?: LoadOptions<TItem>) => PromiseLike<TItem>);
    /**
     * Specifies whether raw data should be saved in the cache. Applies only if loadMode is &apos;raw&apos;.
     */
    cacheRawData?: boolean;
    /**
     * Specifies a custom implementation of the insert(values) method.
     */
    insert?: ((values: TItem) => PromiseLike<TItem>);
    /**
     * Specifies a custom implementation of the load(options) method.
     */
    load: (options: LoadOptions<TItem>) => LoadFunctionResult<LoadResult<TItem>>;
    /**
     * Specifies how data returned by the load function is treated.
     */
    loadMode?: 'processed' | 'raw';
    /**
     * A function that is executed after data is loaded to the store.
     */
    onLoaded?: ((result: LoadResult<TItem>, loadOptions: LoadOptions<TItem>) => void);
    /**
     * Specifies a custom implementation of the remove(key) method.
     */
    remove?: ((key: TKey) => PromiseLike<void>);
    /**
     * Specifies a custom implementation of the totalCount(options) method.
     */
    totalCount?: ((loadOptions: { filter?: FilterDescriptor | Array<FilterDescriptor>; group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>> }) => PromiseLike<number>);
    /**
     * Specifies a custom implementation of the update(key, values) method.
     */
    update?: ((key: TKey, values: TItem) => PromiseLike<any>);
    /**
     * Specifies whether the store combines the search and filter expressions. Defaults to true if the loadMode is &apos;raw&apos; and false if it is &apos;processed&apos;.
     */
    useDefaultSearch?: boolean | undefined;
};

/**
 * The CustomStore enables you to implement custom data access logic for consuming data from any source.
 */
export class CustomStore<
    TItem = any,
    TKey = any,
> extends StoreBase<TItem, TKey> {
    constructor(options?: CustomStoreOptions<TItem, TKey>);
    /**
     * Gets a data item with a specific key.
     */
    byKey(key: TKey, extraOptions?: LoadOptions<TItem>): DxPromise<TItem>;
    /**
     * Deletes data from the cache. Takes effect only if the cacheRawData property is true.
     */
    clearRawDataCache(): void;
    /**
     * Starts loading data.
     */
    load(): DxExtendedPromise<LoadResult<TItem>>;
    /**
     * Starts loading data.
     */
    load(options: LoadOptions<TItem>): DxExtendedPromise<LoadResult<TItem>>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type DataSourceEventName = 'changed' | 'loadError' | 'loadingChanged';

/**
 * 
 */
export type DataSourceOptions<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
    TKey = any,
> = {
    /**
     * Custom parameters that should be passed to an OData service with the load query. Available only for the ODataStore.
     */
    customQueryParams?: any;
    /**
     * Specifies the navigation properties to be loaded with the OData entity. Available only for the ODataStore.
     */
    expand?: Array<string> | string;
    /**
     * Specifies data filtering conditions.
     */
    filter?: FilterDescriptor | Array<FilterDescriptor>;
    /**
     * Specifies data grouping properties.
     */
    group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>;
    /**
                                                              * Specifies parameters for language-specific sorting and filtering.
                                                              */
                                                             langParams?: LangParams;
    /**
     * Specifies an item mapping function.
     */
    map?: ((dataItem: TStoreItem) => TMappedItem);
    /**
     * A function that is executed after data is loaded.
     */
    onChanged?: ((e: { readonly changes?: Array<TMappedItem> }) => void);
    /**
     * A function that is executed when data loading fails.
     */
    onLoadError?: ((error: { readonly message?: string }) => void);
    /**
     * A function that is executed when the data loading status changes.
     */
    onLoadingChanged?: ((isLoading: boolean) => void);
    /**
     * Specifies the maximum number of data items per page. Applies only if paginate is true.
     */
    pageSize?: number;
    /**
     * Specifies whether the DataSource loads data items by pages or all at once. Defaults to false if group is set; otherwise, true.
     */
    paginate?: boolean | undefined;
    /**
     * Specifies a post processing function.
     */
    postProcess?: ((data: Array<TMappedItem>) => Array<TItem>);
    /**
     * Specifies the period (in milliseconds) when changes are aggregated before pushing them to the DataSource.
     */
    pushAggregationTimeout?: number | undefined;
    /**
     * Specifies whether the DataSource requests the total count of data items in the storage.
     */
    requireTotalCount?: boolean;
    /**
     * Specifies whether to reapply sorting, filtering, grouping, and other data processing operations after receiving a push.
     */
    reshapeOnPush?: boolean;
    /**
     * Specifies the fields to search.
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * Specifies the comparison operation used in searching.
     */
    searchOperation?: SearchOperation;
    /**
     * Specifies the value to which the search expression is compared.
     */
    searchValue?: any;
    /**
     * Specifies the fields to select from data objects.
     */
    select?: SelectDescriptor<TItem>;
    /**
     * Specifies data sorting properties.
     */
    sort?: SortDescriptor<TItem> | Array<SortDescriptor<TItem>>;
    /**
     * Configures the store underlying the DataSource.
     */
    store?: Array<TStoreItem> | Store<TStoreItem, TKey> | StoreOptions<TStoreItem, TKey>;
};

/**
 * The DataSource is an object that provides an API for processing data from an underlying store.
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
     * Cancels the load operation with a specific identifier.
     */
    cancel(operationId: number): boolean;
    /**
     * Disposes of all the resources allocated to the DataSource instance.
     */
    dispose(): void;
    /**
     * Gets the filter property&apos;s value.
     */
    filter(): FilterDescriptor | Array<FilterDescriptor>;
    /**
     * Sets the filter property&apos;s value.
     */
    filter(filterExpr: FilterDescriptor | Array<FilterDescriptor>): void;
    /**
     * Gets the group property&apos;s value.
     */
    group(): GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>;
    /**
     * Sets the group property&apos;s value.
     */
    group(groupExpr: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>): void;
    /**
     * Checks whether the count of items on the current page is less than the pageSize. Takes effect only with enabled paging.
     */
    isLastPage(): boolean;
    /**
     * Checks whether data is loaded in the DataSource.
     */
    isLoaded(): boolean;
    /**
     * Checks whether data is being loaded in the DataSource.
     */
    isLoading(): boolean;
    /**
     * Gets an array of data items on the current page.
     */
    items(): Array<any>;
    /**
     * Gets the value of the underlying store&apos;s key property.
     */
    key(): string | Array<string>;
    /**
     * Starts loading data.
     */
    load(): DxExtendedPromise<any>;
    /**
     * Gets an object with current data processing settings.
     */
    loadOptions(): LoadOptions<TItem>;
    /**
     * Detaches all event handlers from a single event.
     */
    off(eventName: DataSourceEventName): this;
    /**
     * Detaches a particular event handler from a single event.
     */
    off(eventName: DataSourceEventName, eventHandler: Function): this;
    /**
     * Subscribes to an event.
     */
    on(eventName: DataSourceEventName, eventHandler: Function): this;
    /**
     * Subscribes to events.
     */
    on(events: { [key in DataSourceEventName]?: Function }): this;
    /**
     * Gets the current page index.
     */
    pageIndex(): number;
    /**
     * Sets the index of the page that should be loaded on the next load() method call.
     */
    pageIndex(newIndex: number): void;
    /**
     * Gets the page size.
     */
    pageSize(): number;
    /**
     * Sets the page size.
     */
    pageSize(value: number): void;
    /**
     * Gets the paginate property&apos;s value.
     */
    paginate(): boolean;
    /**
     * Sets the paginate property&apos;s value.
     */
    paginate(value: boolean): void;
    /**
     * Clears currently loaded DataSource items and calls the load() method.
     */
    reload(): DxExtendedPromise<any>;
    /**
     * Gets the requireTotalCount property&apos;s value.
     */
    requireTotalCount(): boolean;
    /**
     * Sets the requireTotalCount property&apos;s value.
     */
    requireTotalCount(value: boolean): void;
    /**
     * Gets the searchExpr property&apos;s value.
     */
    searchExpr(): string & Function & Array<string | Function>;
    /**
     * Sets the searchExpr property&apos;s value.
     */
    searchExpr(expr: string | Function | Array<string | Function>): void;
    /**
     * Gets the searchOperation property&apos;s value.
     */
    searchOperation(): string;
    /**
     * Sets the searchOperation property&apos;s value.
     */
    searchOperation(op: string): void;
    /**
     * Gets the searchValue property&apos;s value.
     */
    searchValue(): any;
    /**
     * Sets the searchValue property&apos;s value.
     */
    searchValue(value: any): void;
    /**
     * Gets the select property&apos;s value.
     */
    select(): SelectDescriptor<TItem>;
    /**
     * Sets the select property&apos;s value.
     */
    select(expr: SelectDescriptor<TItem>): void;
    /**
     * Gets the sort property&apos;s value.
     */
    sort(): SortDescriptor<TItem> | Array<SortDescriptor<TItem>>;
    /**
     * Sets the sort property&apos;s value.
     */
    sort(sortExpr: SortDescriptor<TItem> | Array<SortDescriptor<TItem>>): void;
    /**
     * Gets the instance of the store underlying the DataSource.
     */
    store(): Store<TItem, TKey>;
    /**
     * Gets the number of data items in the store after the last load() operation without paging. Takes effect only if requireTotalCount is true
     */
    totalCount(): number;
}

/**
 * Specifies parameters for language-specific sorting and filtering.
 */
export type LangParams = {
  /**
   * Specifies the locale whose features affect sorting and filtering.
   */
  locale: string;
  /**
   * Specifies Intl.Collator options.
   */
  collatorOptions?: Intl.CollatorOptions;
};

export type Store<TItem = any, TKey = any> =
  CustomStore<TItem, TKey> |
  ArrayStore<TItem, TKey> |
  LocalStore<TItem, TKey> |
  ODataStore<TItem, TKey>;

export type StoreOptions<TItem = any, TKey = any> =
  CustomStoreOptions<TItem, TKey> |
  ArrayStoreOptions<TItem, TKey> & { type: 'array' } |
  LocalStoreOptions<TItem, TKey> & { type: 'local' } |
  ODataStoreOptions<TItem, TKey> & { type: 'odata' };

/**
 * The EndpointSelector is an object for managing OData endpoints in your application.
 */
export class EndpointSelector {
  constructor(options: any);
  /**
   * Gets an endpoint with a specific key.
   */
  urlFor(key: string): string;
}

/**
 * Specifies the function that is executed when a data layer object throws an error.
 * @deprecated Use setErrorHandler instead.
 */
export function errorHandler(e: Error): void;

/**
 * A method that specifies a function to be executed when a Data Layer component throws an error.
 */
export function setErrorHandler(handler: (e: Error) => void): void;

/**
 * 
 */
export type LocalStoreOptions<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey> & {
    /**
     * Specifies a delay in milliseconds between when data changes and the moment these changes are saved in the local storage. Applies only if immediate is false.
     */
    flushInterval?: number;
    /**
     * Specifies whether the LocalStore saves changes in the local storage immediately.
     */
    immediate?: boolean;
    /**
     * Specifies the name under which data should be saved in the local storage. The `dx-data-localStore-` prefix will be added to the name.
     */
    name?: string;
};

/**
 * The LocalStore is a store that provides an interface for loading and editing data from HTML Web Storage (also known as window.localStorage) and handling related events.
 */
export class LocalStore<
    TItem = any,
    TKey = any,
> extends ArrayStore<TItem, TKey> {
    constructor(options?: LocalStoreOptions<TItem, TKey>);
    /**
     * Removes data from the local storage.
     */
    clear(): void;
}

/**
 * The Query is an object that provides a chainable interface for making data queries.
 */
export type Query = {
    /**
     * Calculates a custom summary for all data items.
     */
    aggregate(seed: any, step: Function, finalize: Function): DxPromise<any>;
    /**
     * Calculates a custom summary for all data items.
     */
    aggregate(step: Function): DxPromise<any>;
    /**
     * Calculates the average of all values. Applies only to numeric arrays.
     */
    avg(): DxPromise<number>;
    /**
     * Calculates the average of all values found using a getter.
     */
    avg(getter: any): DxPromise<number>;
    /**
     * Calculates the number of data items.
     */
    count(): DxPromise<number>;
    /**
     * Executes the Query. This is an asynchronous alternative to the toArray() method.
     */
    enumerate(): DxPromise<any>;
    /**
     * Filters data items using a filter expression.
     */
    filter(criteria: Array<any>): Query;
    /**
     * Filters data items using a custom function.
     */
    filter(predicate: Function): Query;
    /**
     * Groups data items by the specified getter.
     */
    groupBy(getter: any): Query;
    /**
     * Calculates the maximum value. Applies only to numeric arrays.
     */
    max(): DxPromise<number | Date>;
    /**
     * Calculates the maximum of all values found using a getter.
     */
    max(getter: any): DxPromise<number | Date>;
    /**
     * Calculates the minimum value. Applies only to numeric arrays.
     */
    min(): DxPromise<number | Date>;
    /**
     * Calculates the minumum of all values found using a getter.
     */
    min(getter: any): DxPromise<number | Date>;
    /**
     * Selects individual fields from data objects.
     */
    select(...getters: any[]): Query;
    /**
     * Gets a specified number of data items starting from a given index.
     */
    slice(skip: number, take?: number): Query;
    /**
     * Sorts data items by the specified getter in ascending order.
     */
    sortBy(getter: any): Query;
    /**
     * Sorts data items by the specified getter in the specified sorting order.
     */
    sortBy(getter: any, desc: boolean): Query;
    /**
     * Calculates the sum of all values.
     */
    sum(): DxPromise<number>;
    /**
     * Calculates the sum of all values found using a getter.
     */
    sum(getter: any): DxPromise<number>;
    /**
     * Sorts data items by one more getter in ascending order.
     */
    thenBy(getter: any): Query;
    /**
     * Sorts data items by one more getter in the specified sorting order.
     */
    thenBy(getter: any, desc: boolean): Query;
    /**
     * Gets data items associated with the Query. This is a synchronous alternative to the enumerate() method.
     */
    toArray(): Array<any>;
};

/**
 * Creates a Query instance.
 */
export function query(array: Array<any>, queryOptions?: any): Query;

/**
 * Creates a Query instance that accesses a remote data service using its URL.
 */
export function query(url: string, queryOptions: any): Query;

/**
 * Encodes a string or array of bytes in Base64.
 */
export function base64_encode(input: string | Array<number>): string;

/**
 * Compiles a getter function from a getter expression.
 */
export function compileGetter(expr: string | Array<string>): Function;

/**
 * Compiles a setter function from a setter expression.
 */
export function compileSetter(expr: string | Array<string>): Function;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'MERGE';

/**
 * 
 */
export type ODataContextOptions = {
    /**
     * Specifies a function that customizes the request before it is sent to the server.
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * Specifies whether stores in the ODataContext serialize/parse date-time values.
     */
    deserializeDates?: boolean;
    /**
     * Specifies entity collections to be accessed.
     */
    entities?: any;
    /**
     * Specifies a function that is executed when the ODataContext throws an error.
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * Specifies whether to convert string values to lowercase in filter and search requests. Applies to the following operations: &apos;startswith&apos;, &apos;endswith&apos;, &apos;contains&apos;, and &apos;notcontains&apos;.
     */
    filterToLower?: boolean;
    /**
     * Specifies whether data should be sent using JSONP.
     */
    jsonp?: boolean;
    /**
     * Specifies the URL of an OData service.
     */
    url?: string;
    /**
     * Specifies the OData version.
     */
    version?: number;
    /**
     * Specifies whether to send cookies, authorization headers, and client certificates in a cross-origin request.
     */
    withCredentials?: boolean;
};

/**
 * The ODataContext is an object that provides access to an entire OData service.
 */
export class ODataContext {
    constructor(options?: ODataContextOptions);
    /**
     * Invokes an OData operation that returns a value.
     */
    get(operationName: string, params: any): DxPromise<any>;
    /**
     * Invokes an OData operation that returns nothing.
     */
    invoke(operationName: string, params: any, httpMethod: HttpMethod): DxPromise<void>;
    /**
     * Gets a link to an entity with a specific key.
     */
    objectLink(entityAlias: string, key: any | string | number): any;
}

/**
 * 
 */
export type ODataStoreOptions<
    TItem = any,
    TKey = any,
> = AbstractStoreOptions<TItem, TKey> & {
    /**
     * Specifies a function that customizes the request before it is sent to the server.
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * Specifies whether the store serializes/parses date-time values.
     */
    deserializeDates?: boolean;
    /**
     * Specifies a function that is executed when the ODataStore throws an error.
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * Specifies the data field types. Accepts the following types: &apos;String&apos;, &apos;Int32&apos;, &apos;Int64&apos;, &apos;Boolean&apos;, &apos;Single&apos;, &apos;Decimal&apos; and &apos;Guid&apos;.
     */
    fieldTypes?: any;
    /**
     * Specifies whether to convert string values to lowercase in filter and search requests. Applies to the following operations: &apos;startswith&apos;, &apos;endswith&apos;, &apos;contains&apos;, and &apos;notcontains&apos;.
     */
    filterToLower?: boolean;
    /**
     * Specifies whether data should be sent using JSONP.
     */
    jsonp?: boolean;
    /**
     * Specifies the type of the key property or properties.
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * Specifies the URL of an OData entity collection.
     */
    url?: string;
    /**
     * Specifies the OData version.
     */
    version?: number;
    /**
     * Specifies whether to send cookies, authorization headers, and client certificates in a cross-origin request.
     */
    withCredentials?: boolean;
};

/**
 * The ODataStore is a store that provides an interface for loading and editing data from an individual OData entity collection and handling related events.
 */
export class ODataStore<
    TItem = any,
    TKey = any,
> extends AbstractStore<TItem, TKey> {
    constructor(options?: ODataStoreOptions<TItem, TKey>);
    /**
     * Gets an entity with a specific key.
     */
    byKey(key: TKey, extraOptions?: { expand?: string | Array<string>; select?: string | Array<string> }): DxPromise<TItem>;
    /**
     * Creates a Query for the OData endpoint.
     */
    createQuery(loadOptions?: { expand?: string | Array<string>; requireTotalCount?: boolean; customQueryParams?: any }): Query;
}

/**
 * The EdmLiteral is an object for working with primitive data types from the OData&apos;s Abstract Type System that are not supported in JavaScript.
 */
export class EdmLiteral {
    constructor(value: string);
    /**
     * Gets the EdmLiteral&apos;s value converted to a string.
     */
    valueOf(): string;
}

/**
                                                                                                                                                      * Contains built-in OData type converters (for String, Int32, Int64, Boolean, Single, Decimal, and Guid) and allows you to register a custom type converter.
                                                                                                                                                      */
                                                                                                                                                     export var keyConverters: any;
