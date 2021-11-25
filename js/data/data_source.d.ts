import {
    DxPromise,
} from '../core/utils/deferred';

import Store, {
    Options as StoreOptions,
} from './abstract_store';

import {
    Options as CustomStoreOptions,
} from './custom_store';

/** @public */
export type Options = DataSourceOptions;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface DataSourceOptions {
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
    group?: string | Array<any> | Function;
    /**
     * @docid
     * @type_function_param1 dataItem:object
     * @type_function_return object
     * @public
     */
    map?: ((dataItem: any) => any);
    /**
     * @docid
     * @action
     * @public
     */
    onChanged?: ((e: { changes?: Array<any> }) => void);
    /**
     * @docid
     * @action
     * @public
     */
    onLoadError?: ((error: { message?: string }) => void);
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
     * @public
     */
    postProcess?: ((data: Array<any>) => Array<any>);
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
    searchOperation?: string;
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
    select?: string | Array<any> | Function;
    /**
     * @docid
     * @type Sort expression
     * @public
     */
    sort?: string | Array<any> | Function;
    /**
     * @docid
     * @public
     */
    store?: Store | StoreOptions | Array<any> | any;
}
/**
 * @docid
 * @public
 */
export default class DataSource {
    constructor(data: Array<any>);
    constructor(options: CustomStoreOptions | Options);
    constructor(store: Store);
    constructor(url: string);
    /**
     * @docid
     * @publicName cancel(operationId)
     * @public
     */
    cancel(): boolean;
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
     * @return object|string|number
     * @public
     */
    key(): any & string & number;
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
    loadOptions(): any;
    /**
     * @docid
     * @publicName off(eventName)
     * @return this
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @return this
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @return this
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: any): this;
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
     * @public
     */
    select(): any;
    /**
     * @docid
     * @publicName select(expr)
     * @public
     */
    select(expr: any): void;
    /**
     * @docid
     * @publicName sort()
     * @public
     */
    sort(): any;
    /**
     * @docid
     * @publicName sort(sortExpr)
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
