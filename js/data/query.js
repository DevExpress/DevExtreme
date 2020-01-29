const arrayQueryImpl = require('./array_query');
const remoteQueryImpl = require('./remote_query');

const queryImpl = {
    array: arrayQueryImpl,
    remote: remoteQueryImpl
};

const query = function() {
    const impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
    return queryImpl[impl].apply(this, arguments);
};
/**
* @name Query
* @type object
*/


module.exports = query;
module.exports.queryImpl = queryImpl;
