var types = {
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Object]': 'object',
    '[object String]': 'string',
    '[object Null]': 'null' };

var type = function(object) {
    var typeOfObject = Object.prototype.toString.call(object);

    return typeof object === 'object' ?
        types[typeOfObject] || 'object' : typeof object;
};

var isBoolean = function(object) {
    return typeof object === 'boolean';
};

var isExponential = function(value) {
    return isNumeric(value) && value.toString().indexOf('e') !== -1;
};

var isDate = function(object) {
    return type(object) === 'date';
};

var isDefined = function(object) {
    return (object !== null) && (object !== undefined);
};

var isFunction = function(object) {
    return typeof object === 'function';
};

var isString = function(object) {
    return typeof object === 'string';
};

var isNumeric = function(object) {
    return ((typeof object === 'number') && isFinite(object) || !isNaN(object - parseFloat(object)));
};

var isObject = function(object) {
    return type(object) === 'object';
};

var isEmptyObject = function(object) {
    var property;

    for(property in object) {
        return false;
    }

    return true;
};

var isPlainObject = function(object) {
    if(!object || Object.prototype.toString.call(object) !== '[object Object]') {
        return false;
    }
    var proto = Object.getPrototypeOf(object),
        ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

    return typeof ctor === 'function'
        && Object.toString.call(ctor) === Object.toString.call(Object);
};

var isPrimitive = function(value) {
    return ['object', 'array', 'function'].indexOf(type(value)) === -1;
};

var isWindow = function(object) {
    return object != null && object === object.window;
};

var isRenderer = function(object) {
    return !!(object.jquery || object.dxRenderer);
};

var isPromise = function(object) {
    return object && isFunction(object.then);
};

var isDeferred = function(object) {
    return object && isFunction(object.done) && isFunction(object.fail);
};

exports.isBoolean = isBoolean;
exports.isExponential = isExponential;
exports.isDate = isDate;
exports.isDefined = isDefined;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isEmptyObject = isEmptyObject;
exports.isPlainObject = isPlainObject;
exports.isPrimitive = isPrimitive;
exports.isWindow = isWindow;
exports.isRenderer = isRenderer;
exports.isPromise = isPromise;
exports.isDeferred = isDeferred;
exports.type = type;
