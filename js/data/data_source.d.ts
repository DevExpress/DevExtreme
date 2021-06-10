import {
    DxPromise
} from '../core/utils/deferred';

import Store, {
    StoreOptions
} from './abstract_store';

import {
    CustomStoreOptions
} from './custom_store';

type Descriptor = {selector: string, desc: boolean};

/** @namespace DevExpress.data */
export interface DataSourceOptions<TKey = any | string | number, TValueOut = any, TValueIn = TValueOut, TValueMap = TValueOut> {
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
    filter?: string | Array<any> | Function;
    /**
     * @docid
     * @type Group expression
     * @public
     */
    group?: string | Descriptor| Array<Descriptor> | Function;
    /**
     * @docid
     * @type_function_param1 dataItem:object
     * @type_function_return object
     * @public
     */
    map?: ((dataItem: TValueIn) => TValueMap);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field1 changes:Array<any>
     * @action
     * @public
     */
    onChanged?: ((e: { readonly changes?: Array<TValueMap> }) => void);
    /**
     * @docid
     * @type_function_param1 error:Object
     * @type_function_param1_field1 message:string
     * @action
     * @public
     */
    onLoadError?: ((error: { readonly message?: string }) => void);
    /**
     * @docid
     * @type_function_param1 isLoading:boolean
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
    postProcess?: ((data: Array<TValueMap>) => Array<TValueOut>);
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
    searchOperation?: SearchOperations;
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
    select?: string | Array<string> | Function;
    /**
     * @docid
     * @type Sort expression
     * @public
     */
    sort?: string | Descriptor | Array<Descriptor> | Function;
    /**
     * @docid
     * @public
     */
    store?: Store<TKey, TValueIn> | StoreOptions<TKey, TValueIn> | Array<TValueIn>;
}
/**
 * @docid
 * @module data/data_source
 * @export default
 * @public
 */
export default class DataSource<TKey = any | string | number, TValue = any> {
    constructor(data: Array<TValue>);
    constructor(options: CustomStoreOptions<TKey, TValue> | DataSourceOptions<TKey, TValue, any, any>);
    constructor(store: Store<TKey, TValue>);
    constructor(url: string);
    /**
     * @docid
     * @publicName cancel(operationId)
     * @return boolean
     * @public
     */
    cancel(operationId : number): boolean;
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
    filter(): any;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @param1 filterExpr:object
     * @public
     */
    filter(filterExpr: any): void;
    /**
     * @docid
     * @publicName group()
     * @return object
     * @public
     */
    group(): any;
    /**
     * @docid
     * @publicName group(groupExpr)
     * @param1 groupExpr:object
     * @public
     */
    group(groupExpr: any): void;
    /**
     * @docid
     * @publicName isLastPage()
     * @return boolean
     * @public
     */
    isLastPage(): boolean;
    /**
     * @docid
     * @publicName isLoaded()
     * @return boolean
     * @public
     */
    isLoaded(): boolean;
    /**
     * @docid
     * @publicName isLoading()
     * @return boolean
     * @public
     */
    isLoading(): boolean;
    /**
     * @docid
     * @publicName items()
     * @return Array<any>
     * @public
     */
    items(): Array<any>;
    /**
     * @docid
     * @publicName key()
     * @return object|string|number
     * @public
     */
    key(): TKey;
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
    loadOptions(): {sort?: any, filter?: any, select?: any, group?: any, requireTotalCount?: boolean};
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: EventNames): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    off(eventName: EventNames, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    on(eventName: EventNames, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
     on(events: {[key in EventNames]?: Function}): this;
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
     * @return boolean
     * @public
     */
    requireTotalCount(): boolean;
    /**
     * @docid
     * @publicName requireTotalCount(value)
     * @param1 value:boolean
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
     * @return string
     * @public
     */
    searchOperation(): string;
    /**
     * @docid
     * @publicName searchOperation(op)
     * @param1 op:string
     * @public
     */
    searchOperation(op: string): void;
    /**
     * @docid
     * @publicName searchValue()
     * @return any
     * @public
     */
    searchValue(): any;
    /**
     * @docid
     * @publicName searchValue(value)
     * @param1 value:any
     * @public
     */
    searchValue(value: any): void;
    /**
     * @docid
     * @publicName select()
     * @return any
     * @public
     */
    select(): any;
    /**
     * @docid
     * @publicName select(expr)
     * @param1 expr:any
     * @public
     */
    select(expr: any): void;
    /**
     * @docid
     * @publicName sort()
     * @return any
     * @public
     */
    sort(): any;
    /**
     * @docid
     * @publicName sort(sortExpr)
     * @param1 sortExpr:any
     * @public
     */
    sort(sortExpr: any): void;
    /**
     * @docid
     * @publicName store()
     * @return object
     * @public
     */
    store(): any;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @public
     */
    totalCount(): number;
}

type SearchOperations = '='|'<>'|'>'|'>='|'<'|'<='|'startswith'|'endswith'|'contains'|'notcontains';
type EventNames = 'changed'|'loadError'|'loadingChanged'/*|'customizeLoadResult'|'customizeStoreLoadOptions'*/;
