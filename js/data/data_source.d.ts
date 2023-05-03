import {
  FilterDescriptor,
  GroupDescriptor, LangParams,
  LoadOptions,
  SearchOperation,
  SelectDescriptor,
  SortDescriptor,
  Store,
  StoreOptions,
} from './index';
import { DxExtendedPromise } from '../core/utils/deferred';
import { Options as CustomStoreOptions } from './custom_store';

/** @public */
export type Options<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
    TKey = any,
> = DataSourceOptions<TStoreItem, TItem, TMappedItem, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
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
      * @type any
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
 */
export default class DataSource<
    TItem = any,
    TKey = any,
> {
    constructor(data: Array<TItem>);
    constructor(options: CustomStoreOptions<TItem, TKey> | Options<any, any, TItem, TKey>);
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
    off(eventName: EventName): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: EventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    on(eventName: EventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: { [key in EventName]?: Function }): this;
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

type EventName = 'changed' | 'loadError' | 'loadingChanged';
