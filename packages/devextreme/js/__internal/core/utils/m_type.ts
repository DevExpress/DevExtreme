const types = {
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Object]': 'object',
  '[object String]': 'string',
};

const type = function (object) {
  if (object === null) {
    return 'null';
  }

  const typeOfObject = Object.prototype.toString.call(object);

  return typeof object === 'object'
    ? types[typeOfObject] || 'object' : typeof object;
};

const isBoolean = function (object) {
  return typeof object === 'boolean';
};

const isExponential = function (value) {
  return isNumeric(value) && value.toString().indexOf('e') !== -1;
};

const isDate = function (object) {
  return type(object) === 'date';
};

const isDefined = function (object) {
  return (object !== null) && (object !== undefined);
};

const isFunction = function (object) {
  return typeof object === 'function';
};

const isString = function (object) {
  return typeof object === 'string';
};

const isNumeric = function (object) {
  return (typeof object === 'number') && isFinite(object) || !isNaN(object - parseFloat(object));
};

const isObject = function (object) {
  return type(object) === 'object';
};

const isEmptyObject = function (object) {
  let property;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop
  for (property in object) {
    return false;
  }

  return true;
};

const isPlainObject = function (object) {
  if (!object || type(object) !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(object);

  if (!proto) {
    return true;
  }

  const ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

  return typeof ctor === 'function'
        && Object.toString.call(ctor) === Object.toString.call(Object);
};

const isPrimitive = function (value) {
  return !['object', 'array', 'function'].includes(type(value));
};

const isWindow = function (object) {
  return object != null && object === object.window;
};

const isRenderer = function (object) {
  return !!object && !!(object.jquery || object.dxRenderer);
};

const isPromise = function (object) {
  return !!object && isFunction(object.then);
};

const isDeferred = function (object) {
  return !!object && isFunction(object.done) && isFunction(object.fail);
};

const isEvent = function (object) {
  return !!(object && object.preventDefault);
};

export {
  isBoolean,
  isDate,
  isDeferred,
  isDefined,
  isEmptyObject,
  isEvent,
  isExponential,
  isFunction,
  isNumeric,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRenderer,
  isString,
  isWindow,
  type,
};
