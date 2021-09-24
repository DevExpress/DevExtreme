const types = {
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Object]': 'object',
    '[object String]': 'string',
    '[object Null]': 'null' };

function type(object) {
    const typeOfObject = Object.prototype.toString.call(object);

    return typeof object === 'object' ?
        types[typeOfObject] || 'object' : typeof object;
}

function isBoolean(object) {
    return typeof object === 'boolean';
}

function isExponential(value) {
    return isNumeric(value) && value.toString().indexOf('e') !== -1;
}

function isDate(object) {
    return type(object) === 'date';
}

function isDefined(object) {
    return (object !== null) && (object !== undefined);
}

function isFunction(object) {
    return typeof object === 'function';
}

function isString(object) {
    return typeof object === 'string';
}

function isNumeric(object) {
    return ((typeof object === 'number') && isFinite(object) || !isNaN(object - parseFloat(object)));
}

function isObject(object) {
    return type(object) === 'object';
}

function isEmptyObject(object) {
    let property;

    for(property in object) {
        return false;
    }

    return true;
}

function isPlainObject(object) {
    if(!object || Object.prototype.toString.call(object) !== '[object Object]') {
        return false;
    }
    const proto = Object.getPrototypeOf(object);
    const ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

    return typeof ctor === 'function'
        && Object.toString.call(ctor) === Object.toString.call(Object);
}

function isPrimitive(value) {
    return ['object', 'array', 'function'].indexOf(type(value)) === -1;
}

function isWindow(object) {
    return object != null && object === object.window;
}

function isRenderer(object) {
    return !!object && !!(object.jquery || object.dxRenderer);
}

function isPromise(object) {
    return !!object && isFunction(object.then);
}

function isDeferred(object) {
    return !!object && isFunction(object.done) && isFunction(object.fail);
}

function isEvent(object) {
    return !!(object && object.preventDefault);
}

export {
    isBoolean,
    isExponential,
    isDate,
    isDefined,
    isFunction,
    isString,
    isNumeric,
    isObject,
    isEmptyObject,
    isPlainObject,
    isPrimitive,
    isWindow,
    isRenderer,
    isPromise,
    isDeferred,
    type,
    isEvent
};
