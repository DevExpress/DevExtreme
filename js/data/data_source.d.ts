import {
    JQueryPromise
} from '../common';

import Store, {
    StoreOptions
} from './abstract_store';

import {
    CustomStoreOptions
} from './custom_store';

export interface DataSourceOptions {
    /**
     * @docid DataSourceOptions.customQueryParams
     * @type Object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid DataSourceOptions.expand
     * @type Array<string>|string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    expand?: Array<string> | string;
    /**
     * @docid DataSourceOptions.filter
     * @type Filter expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter?: string | Array<any> | Function;
    /**
     * @docid DataSourceOptions.group
     * @type Group expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group?: string | Array<any> | Function;
    /**
     * @docid DataSourceOptions.map
     * @type function
     * @type_function_param1 dataItem:object
     * @type_function_return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    map?: ((dataItem: any) => any);
    /**
     * @docid DataSourceOptions.onChanged
     * @type function
     * @type_function_param1 e:Object
     * @type_function_param1_field1 changes:Array<any>
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onChanged?: ((e: { changes?: Array<any> }) => any);
    /**
     * @docid DataSourceOptions.onLoadError
     * @type function
     * @type_function_param1 error:Object
     * @type_function_param1_field1 message:string
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoadError?: ((error: { message?: string }) => any);
    /**
     * @docid DataSourceOptions.onLoadingChanged
     * @type function
     * @type_function_param1 isLoading:boolean
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoadingChanged?: ((isLoading: boolean) => any);
    /**
     * @docid DataSourceOptions.pageSize
     * @type number
     * @default 20
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageSize?: number;
    /**
     * @docid DataSourceOptions.paginate
     * @type Boolean
     * @default undefined
     * @prevFileNamespace DevExpress.data
     * @public
     */
    paginate?: boolean;
    /**
     * @docid DataSourceOptions.postProcess
     * @type function
     * @type_function_param1 data:Array<any>
     * @type_function_return Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    postProcess?: ((data: Array<any>) => Array<any>);
    /**
     * @docid DataSourceOptions.pushAggregationTimeout
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pushAggregationTimeout?: number;
    /**
     * @docid DataSourceOptions.requireTotalCount
     * @type Boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount?: boolean;
    /**
     * @docid DataSourceOptions.reshapeOnPush
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    reshapeOnPush?: boolean;
    /**
     * @docid DataSourceOptions.searchExpr
     * @type getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid DataSourceOptions.searchOperation
     * @type string
     * @default "contains"
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation?: string;
    /**
     * @docid DataSourceOptions.searchValue
     * @type any
     * @default null
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue?: any;
    /**
     * @docid DataSourceOptions.select
     * @type Select expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select?: string | Array<any> | Function;
    /**
     * @docid DataSourceOptions.sort
     * @type Sort expression
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort?: string | Array<any> | Function;
    /**
     * @docid DataSourceOptions.store
     * @type Store|StoreOptions|Array<any>|any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    store?: Store | StoreOptions | Array<any> | any;
}
/**
 * @docid DataSource
 * @type object
 * @inherits EventsMixin
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
     * @docid DataSourceMethods.cancel
     * @publicName cancel(operationId)
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    cancel(): boolean;
    /**
     * @docid DataSourceMethods.dispose
     * @publicName dispose()
     * @prevFileNamespace DevExpress.data
     * @public
     */
    dispose(): void;
    /**
     * @docid DataSourceMethods.filter
     * @publicName filter()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(): any;
    /**
     * @docid DataSourceMethods.filter
     * @publicName filter(filterExpr)
     * @param1 filterExpr:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(filterExpr: any): void;
    /**
     * @docid DataSourceMethods.group
     * @publicName group()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group(): any;
    /**
     * @docid DataSourceMethods.group
     * @publicName group(groupExpr)
     * @param1 groupExpr:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group(groupExpr: any): void;
    /**
     * @docid DataSourceMethods.isLastPage
     * @publicName isLastPage()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    isLastPage(): boolean;
    /**
     * @docid DataSourceMethods.isLoaded
     * @publicName isLoaded()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    isLoaded(): boolean;
    /**
     * @docid DataSourceMethods.isLoading
     * @publicName isLoading()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    isLoading(): boolean;
    /**
     * @docid DataSourceMethods.items
     * @publicName items()
     * @return Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    items(): Array<any>;
    /**
     * @docid DataSourceMethods.key
     * @publicName key()
     * @return object|string|number
     * @prevFileNamespace DevExpress.data
     * @public
     */
    key(): any & string & number;
    /**
     * @docid DataSourceMethods.load
     * @publicName load()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    load(): Promise<any> & JQueryPromise<any>;
    /**
     * @docid DataSourceMethods.loadOptions
     * @publicName loadOptions()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    loadOptions(): any;
    off(eventName: string): this;
    off(eventName: string, eventHandler: Function): this;
    on(eventName: string, eventHandler: Function): this;
    on(events: any): this;
    /**
     * @docid DataSourceMethods.pageIndex
     * @publicName pageIndex()
     * @return numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageIndex(): number;
    /**
     * @docid DataSourceMethods.pageIndex
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageIndex(newIndex: number): void;
    /**
     * @docid DataSourceMethods.pageSize
     * @publicName pageSize()
     * @return numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageSize(): number;
    /**
     * @docid DataSourceMethods.pageSize
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid DataSourceMethods.paginate
     * @publicName paginate()
     * @return Boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    paginate(): boolean;
    /**
     * @docid DataSourceMethods.paginate
     * @publicName paginate(value)
     * @param1 value:Boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    paginate(value: boolean): void;
    /**
     * @docid DataSourceMethods.reload
     * @publicName reload()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    reload(): Promise<any> & JQueryPromise<any>;
    /**
     * @docid DataSourceMethods.requireTotalCount
     * @publicName requireTotalCount()
     * @return boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount(): boolean;
    /**
     * @docid DataSourceMethods.requireTotalCount
     * @publicName requireTotalCount(value)
     * @param1 value:boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount(value: boolean): void;
    /**
     * @docid DataSourceMethods.searchExpr
     * @publicName searchExpr()
     * @return getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr(): string & Function & Array<string | Function>;
    /**
     * @docid DataSourceMethods.searchExpr
     * @publicName searchExpr(expr)
     * @param1 expr:getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr(expr: string | Function | Array<string | Function>): void;
    /**
     * @docid DataSourceMethods.searchOperation
     * @publicName searchOperation()
     * @return string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation(): string;
    /**
     * @docid DataSourceMethods.searchOperation
     * @publicName searchOperation(op)
     * @param1 op:string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation(op: string): void;
    /**
     * @docid DataSourceMethods.searchValue
     * @publicName searchValue()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue(): any;
    /**
     * @docid DataSourceMethods.searchValue
     * @publicName searchValue(value)
     * @param1 value:any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue(value: any): void;
    /**
     * @docid DataSourceMethods.select
     * @publicName select()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select(): any;
    /**
     * @docid DataSourceMethods.select
     * @publicName select(expr)
     * @param1 expr:any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select(expr: any): void;
    /**
     * @docid DataSourceMethods.sort
     * @publicName sort()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort(): any;
    /**
     * @docid DataSourceMethods.sort
     * @publicName sort(sortExpr)
     * @param1 sortExpr:any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort(sortExpr: any): void;
    /**
     * @docid DataSourceMethods.store
     * @publicName store()
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    store(): any;
    /**
     * @docid DataSourceMethods.totalCount
     * @publicName totalCount()
     * @return numeric
     * @prevFileNamespace DevExpress.data
     * @public
     */
    totalCount(): number;
}
