import {
    TPromise
} from '../core/utils/deferred';

import Store, {
    StoreOptions
} from './abstract_store';

import {
    CustomStoreOptions
} from './custom_store';

export interface DataSourceOptions {
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    expand?: Array<string> | string;
    /**
     * @docid
     * @type Filter expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter?: string | Array<any> | Function;
    /**
     * @docid
     * @type Group expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group?: string | Array<any> | Function;
    /**
     * @docid
     * @type_function_param1 dataItem:object
     * @type_function_return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    map?: ((dataItem: any) => any);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field1 changes:Array<any>
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onChanged?: ((e: { changes?: Array<any> }) => any);
    /**
     * @docid
     * @type_function_param1 error:Object
     * @type_function_param1_field1 message:string
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoadError?: ((error: { message?: string }) => any);
    /**
     * @docid
     * @type_function_param1 isLoading:boolean
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoadingChanged?: ((isLoading: boolean) => any);
    /**
     * @docid
     * @default 20
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageSize?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.data
     * @public
     */
    paginate?: boolean;
    /**
     * @docid
     * @type_function_param1 data:Array<any>
     * @type_function_return Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    postProcess?: ((data: Array<any>) => Array<any>);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pushAggregationTimeout?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    reshapeOnPush?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @default "contains"
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation?: string;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue?: any;
    /**
     * @docid
     * @type Select expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select?: string | Array<any> | Function;
    /**
     * @docid
     * @type Sort expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort?: string | Array<any> | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    store?: Store | StoreOptions | Array<any> | any;
}
/**
 * @docid
 * @module data/data_source
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class DataSource {
    constructor(data: Array<any>);
    constructor(options: CustomStoreOptions | DataSourceOptions);
    constructor(store: Store);
    constructor(url: string);
    /**
     * @docid
     * @publicName cancel(operationId)
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    cancel(): boolean;
    /**
     * @docid
     * @publicName dispose()
     * @prevFileNamespace DevExpress.data
     * @public
     */
    dispose(): void;
    /**
     * @docid
     * @publicName filter()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(): any;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @param1 filterExpr:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(filterExpr: any): void;
    /**
     * @docid
     * @publicName group()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group(): any;
    /**
     * @docid
     * @publicName group(groupExpr)
     * @param1 groupExpr:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group(groupExpr: any): void;
    /**
     * @docid
     * @publicName isLastPage()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    isLastPage(): boolean;
    /**
     * @docid
     * @publicName isLoaded()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    isLoaded(): boolean;
    /**
     * @docid
     * @publicName isLoading()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    isLoading(): boolean;
    /**
     * @docid
     * @publicName items()
     * @return Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    items(): Array<any>;
    /**
     * @docid
     * @publicName key()
     * @return object|string|number
     * @prevFileNamespace DevExpress.data
     * @public
     */
    key(): any & string & number;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    load(): TPromise<any>;
    /**
     * @docid
     * @publicName loadOptions()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    loadOptions(): any;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    on(events: any): this;
    /**
     * @docid
     * @publicName pageIndex()
     * @return numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageIndex(): number;
    /**
     * @docid
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageIndex(newIndex: number): void;
    /**
     * @docid
     * @publicName pageSize()
     * @return numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageSize(): number;
    /**
     * @docid
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid
     * @publicName paginate()
     * @return Boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    paginate(): boolean;
    /**
     * @docid
     * @publicName paginate(value)
     * @param1 value:Boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    paginate(value: boolean): void;
    /**
     * @docid
     * @publicName reload()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    reload(): TPromise<any>;
    /**
     * @docid
     * @publicName requireTotalCount()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount(): boolean;
    /**
     * @docid
     * @publicName requireTotalCount(value)
     * @param1 value:boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount(value: boolean): void;
    /**
     * @docid
     * @publicName searchExpr()
     * @return getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr(): string & Function & Array<string | Function>;
    /**
     * @docid
     * @publicName searchExpr(expr)
     * @param1 expr:getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr(expr: string | Function | Array<string | Function>): void;
    /**
     * @docid
     * @publicName searchOperation()
     * @return string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation(): string;
    /**
     * @docid
     * @publicName searchOperation(op)
     * @param1 op:string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation(op: string): void;
    /**
     * @docid
     * @publicName searchValue()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue(): any;
    /**
     * @docid
     * @publicName searchValue(value)
     * @param1 value:any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue(value: any): void;
    /**
     * @docid
     * @publicName select()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select(): any;
    /**
     * @docid
     * @publicName select(expr)
     * @param1 expr:any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select(expr: any): void;
    /**
     * @docid
     * @publicName sort()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort(): any;
    /**
     * @docid
     * @publicName sort(sortExpr)
     * @param1 sortExpr:any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort(sortExpr: any): void;
    /**
     * @docid
     * @publicName store()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    store(): any;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    totalCount(): number;
}
