var arrayQueryImpl = require('./array_query'),
    remoteQueryImpl = require('./remote_query');

var queryImpl = {
    array: arrayQueryImpl,
    remote: remoteQueryImpl
};

/**
* @name Utils.query
* @publicName query(array)
* @param1 array:Array<any>
* @return Query
* @namespace DevExpress.data
* @module data/query
* @export default
*/
/**
* @name Utils.query
* @publicName query(url, queryOptions)
* @param1 url:string
* @param2 queryOptions:object
* @return Query
* @namespace DevExpress.data
* @module data/query
* @export default
*/
var query = function() {
    var impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
    return queryImpl[impl].apply(this, arguments);
};
/**
* @name Query
* @type object
*/

/**
* @name QueryMethods.enumerate
* @publicName enumerate()
* @return Promise<any>
*/

/**
* @name QueryMethods.toArray
* @publicName toArray()
* @return Array<any>
*/

/**
* @name QueryMethods.sortBy
* @publicName sortBy(getter)
* @param1 getter:object
* @return Query
*/
/**
* @name QueryMethods.sortBy
* @publicName sortBy(getter, desc)
* @param1 getter:object
* @param2 desc:boolean
* @return Query
*/

/**
* @name QueryMethods.thenBy
* @publicName thenBy(getter)
* @param1 getter:object
* @return Query
*/
/**
* @name QueryMethods.thenBy
* @publicName thenBy(getter, desc)
* @param1 getter:object
* @param2 desc:boolean
* @return Query
*/

/**
* @name QueryMethods.filter
* @publicName filter(criteria)
* @param1 criteria:Array<any>
* @return Query
*/
/**
* @name QueryMethods.filter
* @publicName filter(predicate)
* @param1 predicate:function
* @return Query
*/

/**
* @name QueryMethods.slice
* @publicName slice(skip, take)
* @param1 skip:number
* @param2 take:number|undefined
* @return Query
*/

/**
* @name QueryMethods.select
* @publicName select(getter)
* @param1 getter:object
* @return Query
*/

/**
* @name QueryMethods.groupBy
* @publicName groupBy(getter)
* @param1 getter:object
* @return Query
*/

/**
* @name QueryMethods.aggregate
* @publicName aggregate(seed, step, finalize)
* @param1 seed:object
* @param2 step:function
* @param3 finalize:function
* @return Promise<any>
*/
/**
* @name QueryMethods.aggregate
* @publicName aggregate(step)
* @param1 step:function
* @return Promise<any>
*/

/**
* @name QueryMethods.count
* @publicName count()
* @return Promise<number>
*/

/**
* @name QueryMethods.sum
* @publicName sum()
* @return Promise<number>
*/
/**
* @name QueryMethods.sum
* @publicName sum(getter)
* @param1 getter:object
* @return Promise<number>
*/

/**
* @name QueryMethods.min
* @publicName min()
* @return Promise<number,Date>
*/
/**
* @name QueryMethods.min
* @publicName min(getter)
* @param1 getter:object
* @return Promise<number,Date>
*/

/**
* @name QueryMethods.max
* @publicName max()
* @return Promise<number,Date>
*/
/**
* @name QueryMethods.max
* @publicName max(getter)
* @param1 getter:object
* @return Promise<number,Date>
*/

/**
* @name QueryMethods.avg
* @publicName avg()
* @return Promise<number>
*/
/**
* @name QueryMethods.avg
* @publicName avg(getter)
* @param1 getter:object
* @return Promise<number>
*/
module.exports = query;
module.exports.queryImpl = queryImpl;
