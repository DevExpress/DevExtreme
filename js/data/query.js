"use strict";

var arrayQueryImpl = require("./array_query"),
    remoteQueryImpl = require("./remote_query");

var queryImpl = {
    array: arrayQueryImpl,
    remote: remoteQueryImpl
};

/**
* @name Utils_query
* @publicName query(array)
* @param1 array:Array<any>
* @return Query
* @namespace DevExpress.data
* @module data/query
* @export default
*/
/**
* @name Utils_query
* @publicName query(url, queryOptions)
* @param1 url:string
* @param2 queryOptions:object
* @return Query
* @namespace DevExpress.data
* @module data/query
* @export default
*/
var query = function() {
    var impl = Array.isArray(arguments[0]) ? "array" : "remote";
    return queryImpl[impl].apply(this, arguments);
};
/**
* @name Query
* @publicName Query
* @type object
*/

/**
* @name QueryMethods_enumerate
* @publicName enumerate()
* @return Promise<any>
*/

/**
* @name QueryMethods_toArray
* @publicName toArray()
* @return Array<any>
*/

/**
* @name QueryMethods_sortBy
* @publicName sortBy(getter)
* @param1 getter:object
* @return Query
*/
/**
* @name QueryMethods_sortBy
* @publicName sortBy(getter, desc)
* @param1 getter:object
* @param2 desc:boolean
* @return Query
*/

/**
* @name QueryMethods_thenBy
* @publicName thenBy(getter)
* @param1 getter:object
* @return Query
*/
/**
* @name QueryMethods_thenBy
* @publicName thenBy(getter, desc)
* @param1 getter:object
* @param2 desc:boolean
* @return Query
*/

/**
* @name QueryMethods_filter
* @publicName filter(criteria)
* @param1 criteria:Array<any>
* @return Query
*/
/**
* @name QueryMethods_filter
* @publicName filter(predicate)
* @param1 predicate:function
* @return Query
*/

/**
* @name QueryMethods_slice
* @publicName slice(skip, take)
* @param1 skip:number
* @param2 take:number|undefined
* @return Query
*/

/**
* @name QueryMethods_select
* @publicName select(getter)
* @param1 getter:object
* @return Query
*/

/**
* @name QueryMethods_groupBy
* @publicName groupBy(getter)
* @param1 getter:object
* @return Query
*/

/**
* @name QueryMethods_aggregate
* @publicName aggregate(seed, step, finalize)
* @param1 seed:object
* @param2 step:function
* @param3 finalize:function
* @return Promise<any>
*/
/**
* @name QueryMethods_aggregate
* @publicName aggregate(step)
* @param1 step:function
* @return Promise<any>
*/

/**
* @name QueryMethods_count
* @publicName count()
* @return Promise<number>
*/

/**
* @name QueryMethods_sum
* @publicName sum()
* @return Promise<number>
*/
/**
* @name QueryMethods_sum
* @publicName sum(getter)
* @param1 getter:object
* @return Promise<number>
*/

/**
* @name QueryMethods_min
* @publicName min()
* @return Promise<number,Date>
*/
/**
* @name QueryMethods_min
* @publicName min(getter)
* @param1 getter:object
* @return Promise<number,Date>
*/

/**
* @name QueryMethods_max
* @publicName max()
* @return Promise<number,Date>
*/
/**
* @name QueryMethods_max
* @publicName max(getter)
* @param1 getter:object
* @return Promise<number,Date>
*/

/**
* @name QueryMethods_avg
* @publicName avg()
* @return Promise<number>
*/
/**
* @name QueryMethods_avg
* @publicName avg(getter)
* @param1 getter:object
* @return Promise<number>
*/
module.exports = query;
module.exports.queryImpl = queryImpl;
