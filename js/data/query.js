import { queryImpl } from './query_implementation';

const query = function() {
    const impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
    return queryImpl[impl].apply(this, arguments);
};

/**
* @name Query
* @type object
*/


export default query;
