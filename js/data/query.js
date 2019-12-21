var arrayQueryImpl = require('./array_query'),
    remoteQueryImpl = require('./remote_query');

var queryImpl = {
    array: arrayQueryImpl,
    remote: remoteQueryImpl
};

var query = function() {
    var impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
    return queryImpl[impl].apply(this, arguments);
};
/**
* @name Query
* @type object
*/


module.exports = query;
module.exports.queryImpl = queryImpl;
