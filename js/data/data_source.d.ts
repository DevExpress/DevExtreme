import {
 FilterDescriptor, GroupDescriptor, SelectDescriptor, SortDescriptor, LoadOptions, SearchOperation,
} from './index';
import { DxPromise } from '../core/utils/deferred';
import Store from './abstract_store';
import { CustomStoreOptions } from './custom_store';
import { ArrayStoreOptions } from './array_store';
import { LocalStoreOptions } from './local_store';
import { ODataStoreOptions } from './odata/store';

/** @namespace DevExpress.data */
export interface DataSourceOptions
<TSourceValue = any, TValue = TSourceValue, TMappedValue = TValue,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
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
    group?: GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>>;
    /**
     * @docid
     * @type_function_param1 dataItem:object
     * @type_function_return object
     * @public
     */
    map?: ((dataItem: TSourceValue) => TMappedValue);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field1 changes:Array<any>
     * @action
     * @public
     */
    onChanged?: ((e: { readonly changes?: Array<TMappedValue> }) => void);
    /**
     * @docid
     * @type_function_param1 error:Object
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
    postProcess?: ((data: Array<TMappedValue>) => Array<TValue>);
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
    select?: SelectDescriptor<TValue> | Array<SelectDescriptor<TValue>>;
    /**
     * @docid
     * @type Sort expression
     * @public
     */
    sort?: SortDescriptor<TValue> | Array<SortDescriptor<TValue>>;
    /**
     * @docid
     * @public
     * @type Store|StoreOptions|Array<any>
     */
    store?: Array<TSourceValue> |
        Store<TSourceValue, TKeyExpr, TKey> |
        ArrayStoreOptions<TSourceValue, TKeyExpr, TKey> & { type: 'array' } |
        LocalStoreOptions<TSourceValue, TKeyExpr, TKey> & { type: 'local' } |
        ODataStoreOptions<TSourceValue, TKeyExpr, TKey> & { type: 'odata' } |
        CustomStoreOptions<TSourceValue, TKeyExpr, TKey>;
}
/**
 * @docid
 * @public
 */
export default class DataSource
<TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> {
    constructor(data: Array<TValue>);
    constructor(options: CustomStoreOptions<TValue, TKeyExpr, TKey> | DataSourceOptions<any, TValue, any, TKeyExpr, TKey>);
    constructor(store: Store<TValue, TKeyExpr, TKey>);
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
    group(): GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>>;
    /**
     * @docid
     * @publicName group(groupExpr)
     * @param1 groupExpr:object
     * @public
     */
    group(groupExpr: GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>>): void;
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
     * @return string | Array<string>
     * @public
     */
    key(): TKeyExpr;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @public
     */
    load(): DxPromise<any>;
    /**
     * @docid
     * @publicName loadOptions()
     * @return object
     * @public
     */
    loadOptions(): LoadOptions<TValue>;
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
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    off(eventName: EventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
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
     * @return Boolean
     * @public
     */
    paginate(): boolean;
    /**
     * @docid
     * @publicName paginate(value)
     * @param1 value:Boolean
     * @public
     */
    paginate(value: boolean): void;
    /**
     * @docid
     * @publicName reload()
     * @return Promise<any>
     * @public
     */
    reload(): DxPromise<any>;
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
    select(): SelectDescriptor<TValue> | Array<SelectDescriptor<TValue>>;
    /**
     * @docid
     * @publicName select(expr)
     * @param1 expr:any
     * @public
     */
    select(expr: SelectDescriptor<TValue> | Array<SelectDescriptor<TValue>>): void;
    /**
     * @docid
     * @publicName sort()
     * @return any
     * @public
     */
    sort(): SortDescriptor<TValue> | Array<SortDescriptor<TValue>>;
    /**
     * @docid
     * @publicName sort(sortExpr)
     * @param1 sortExpr:any
     * @public
     */
    sort(sortExpr: SortDescriptor<TValue> | Array<SortDescriptor<TValue>>): void;
    /**
     * @docid
     * @publicName store()
     * @return object
     * @public
     */
    store(): Store<TValue, TKeyExpr, TKey>;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @public
     */
    totalCount(): number;
}

type EventName = 'changed' | 'loadError' | 'loadingChanged';
