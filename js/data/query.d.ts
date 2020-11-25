import '../jquery_augmentation';

export interface Query {
    /**
     * @docid Query.aggregate
     * @publicName aggregate(seed, step, finalize)
     * @param1 seed:object
     * @param2 step:function
     * @param3 finalize:function
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    aggregate(seed: any, step: Function, finalize: Function): Promise<any> & JQueryPromise<any>;
    /**
     * @docid Query.aggregate
     * @publicName aggregate(step)
     * @param1 step:function
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    aggregate(step: Function): Promise<any> & JQueryPromise<any>;
    /**
     * @docid Query.avg
     * @publicName avg()
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    avg(): Promise<number> & JQueryPromise<number>;
    /**
     * @docid Query.avg
     * @publicName avg(getter)
     * @param1 getter:object
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    avg(getter: any): Promise<number> & JQueryPromise<number>;
    /**
     * @docid Query.count
     * @publicName count()
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    count(): Promise<number> & JQueryPromise<number>;
    /**
     * @docid Query.enumerate
     * @publicName enumerate()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    enumerate(): Promise<any> & JQueryPromise<any>;
    /**
     * @docid Query.filter
     * @publicName filter(criteria)
     * @param1 criteria:Array<any>
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(criteria: Array<any>): Query;
    /**
     * @docid Query.filter
     * @publicName filter(predicate)
     * @param1 predicate:function
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter(predicate: Function): Query;
    /**
     * @docid Query.groupBy
     * @publicName groupBy(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    groupBy(getter: any): Query;
    /**
     * @docid Query.max
     * @publicName max()
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    max(): Promise<number | Date> & JQueryPromise<number | Date>;
    /**
     * @docid Query.max
     * @publicName max(getter)
     * @param1 getter:object
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    max(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
    /**
     * @docid Query.min
     * @publicName min()
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    min(): Promise<number | Date> & JQueryPromise<number | Date>;
    /**
     * @docid Query.min
     * @publicName min(getter)
     * @param1 getter:object
     * @return Promise<number,Date>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    min(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
    /**
     * @docid Query.select
     * @publicName select(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select(getter: any): Query;
    /**
     * @docid Query.slice
     * @publicName slice(skip, take)
     * @param1 skip:number
     * @param2 take:number|undefined
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    slice(skip: number, take?: number): Query;
    /**
     * @docid Query.sortBy
     * @publicName sortBy(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sortBy(getter: any): Query;
    /**
     * @docid Query.sortBy
     * @publicName sortBy(getter, desc)
     * @param1 getter:object
     * @param2 desc:boolean
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sortBy(getter: any, desc: boolean): Query;
    /**
     * @docid Query.sum
     * @publicName sum()
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sum(): Promise<number> & JQueryPromise<number>;
    /**
     * @docid Query.sum
     * @publicName sum(getter)
     * @param1 getter:object
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sum(getter: any): Promise<number> & JQueryPromise<number>;
    /**
     * @docid Query.thenBy
     * @publicName thenBy(getter)
     * @param1 getter:object
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    thenBy(getter: any): Query;
    /**
     * @docid Query.thenBy
     * @publicName thenBy(getter, desc)
     * @param1 getter:object
     * @param2 desc:boolean
     * @return Query
     * @prevFileNamespace DevExpress.data
     * @public
     */
    thenBy(getter: any, desc: boolean): Query;
    /**
     * @docid Query.toArray
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
