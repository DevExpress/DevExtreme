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
     * @public
     */
    aggregate(seed: any, step: Function, finalize: Function): DxPromise<any>;
    /**
     * @docid
     * @publicName aggregate(step)
     * @param1 step:function
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
     * @param1 criteria:Array<any>
     * @return Query
     * @public
     */
    filter(criteria: Array<any>): Query;
    /**
     * @docid
     * @publicName filter(predicate)
     * @param1 predicate:function
     * @return Query
     * @public
     */
    filter(predicate: Function): Query;
    /**
     * @docid
     * @publicName groupBy(getter)
     * @param1 getter:object
     * @return Query
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
     * @param1 getter:object
     * @return Query
     * @public
     */
    select(getter: any): Query;
    /**
     * @docid
     * @publicName slice(skip, take)
     * @param1 skip:number
     * @param2 take:number|undefined
     * @return Query
     * @public
     */
    slice(skip: number, take?: number): Query;
    /**
     * @docid
     * @publicName sortBy(getter)
     * @param1 getter:object
     * @return Query
     * @public
     */
    sortBy(getter: any): Query;
    /**
     * @docid
     * @publicName sortBy(getter, desc)
     * @param1 getter:object
     * @param2 desc:boolean
     * @return Query
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
     * @return Query
     * @public
     */
    thenBy(getter: any): Query;
    /**
     * @docid
     * @publicName thenBy(getter, desc)
     * @param1 getter:object
     * @param2 desc:boolean
     * @return Query
     * @public
     */
    thenBy(getter: any, desc: boolean): Query;
    /**
     * @docid
     * @publicName toArray()
     * @return Array<any>
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
 * @public
 */
declare function query(url: string, queryOptions: any): Query;

export default query;
