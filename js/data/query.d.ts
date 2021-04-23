import {
    DxPromise
} from '../core/utils/deferred';

/**
 * @docid
 * @type object
 */
export interface Query {
    /**
     * @docid
     * @publicName aggregate(seed, step, finalize)
     * @param1 seed:object
     * @param2 step:function
     * @param3 finalize:function
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    aggregate(seed: any, step: Function, finalize: Function): DxPromise<any>;
    /**
     * @docid
     * @publicName aggregate(step)
     * @param1 step:function
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    aggregate(step: Function): DxPromise<any>;
    /**
     * @docid
     * @publicName avg()
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    avg(): DxPromise<number>;
    /**
     * @docid
     * @publicName avg(getter)
     * @param1 getter:object
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    avg(getter: any): DxPromise<number>;
    /**
     * @docid
     * @publicName count()
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    count(): DxPromise<number>;
    /**
     * @docid
     * @publicName enumerate()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    enumerate(): DxPromise<any>;
    /**
     * @docid
     * @publicName filter(criteria)
     * @param1 criteria:Array<any>
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(criteria: Array<any>): Query;
    /**
     * @docid
     * @publicName filter(predicate)
     * @param1 predicate:function
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(predicate: Function): Query;
    /**
     * @docid
     * @publicName groupBy(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    groupBy(getter: any): Query;
    /**
     * @docid
     * @publicName max()
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    max(): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName max(getter)
     * @param1 getter:object
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    max(getter: any): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName min()
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    min(): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName min(getter)
     * @param1 getter:object
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    min(getter: any): DxPromise<number | Date>;
    /**
     * @docid
     * @publicName select(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select(getter: any): Query;
    /**
     * @docid
     * @publicName slice(skip, take)
     * @param1 skip:number
     * @param2 take:number|undefined
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    slice(skip: number, take?: number): Query;
    /**
     * @docid
     * @publicName sortBy(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sortBy(getter: any): Query;
    /**
     * @docid
     * @publicName sortBy(getter, desc)
     * @param1 getter:object
     * @param2 desc:boolean
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sortBy(getter: any, desc: boolean): Query;
    /**
     * @docid
     * @publicName sum()
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sum(): DxPromise<number>;
    /**
     * @docid
     * @publicName sum(getter)
     * @param1 getter:object
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sum(getter: any): DxPromise<number>;
    /**
     * @docid
     * @publicName thenBy(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    thenBy(getter: any): Query;
    /**
     * @docid
     * @publicName thenBy(getter, desc)
     * @param1 getter:object
     * @param2 desc:boolean
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    thenBy(getter: any, desc: boolean): Query;
    /**
     * @docid
     * @publicName toArray()
     * @return Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    toArray(): Array<any>;
}

/**
 * @docid Utils.query
 * @publicName query(array)
 * @param1 array:Array<any>
 * @return Query
 * @namespace DevExpress.data
 * @module data/query
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
declare function query(array: Array<any>): Query;

/**
 * @docid Utils.query
 * @publicName query(url, queryOptions)
 * @param1 url:string
 * @param2 queryOptions:object
 * @return Query
 * @namespace DevExpress.data
 * @module data/query
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
declare function query(url: string, queryOptions: any): Query;

export default query;
