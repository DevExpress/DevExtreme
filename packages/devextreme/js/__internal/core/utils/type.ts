type AnyFunction = (...args: unknown[]) => unknown;

const types: Record<string, string | undefined> = {
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Object]': 'object',
  '[object String]': 'string',
};

const type = function type(object: unknown): string {
  if (object === null) {
    return 'null';
  }

  const typeOfObject = Object.prototype.toString.call(object);

  return typeof object === 'object'
    ? types[typeOfObject] ?? 'object' : typeof object;
};

const isBoolean = function isBoolean(object: unknown): object is boolean {
  return typeof object === 'boolean';
};

const isNumeric = function isNumeric(object: unknown): boolean {
  return ((typeof object === 'number') && isFinite(object))
    // @ts-expect-error the check converts any value to a number
    || !isNaN(object - parseFloat(object));
};

const isExponential = function isExponential(value: unknown): boolean {
  // @ts-expect-error a numeric value is neither null nor undefined
  return isNumeric(value) && value.toString().indexOf('e') !== -1;
};

const isDate = function isDate(object: unknown): object is Date {
  return type(object) === 'date';
};

const isDefined = function isDefined<T>(object: T | null | undefined): object is T {
  return (object !== null) && (object !== undefined);
};

const isFunction = function isFunction(object: unknown): object is AnyFunction {
  return typeof object === 'function';
};

const isString = function isString(object: unknown): object is string {
  return typeof object === 'string';
};

const isObject = function isObject(object: unknown): object is Record<string, unknown> {
  return type(object) === 'object';
};

const isEmptyObject = function isEmptyObject(object: unknown): boolean {
  // @ts-expect-error for...in reads the keys of any value
  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop -- any key
  for (const property in object) {
    return false;
  }

  return true;
};

const isPlainObject = function isPlainObject(
  object: unknown,
): object is Record<string, unknown> {
  if (!object || type(object) !== 'object') {
    return false;
  }
  const proto: { constructor?: unknown } | null = Object.getPrototypeOf(object);

  if (!proto) {
    return true;
  }

  const ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

  return typeof ctor === 'function'
      && Object.toString.call(ctor) === Object.toString.call(Object);
};

const isPrimitive = function isPrimitive(value: unknown): boolean {
  return !['object', 'array', 'function'].includes(type(value));
};

const isWindow = function isWindow(object: unknown): boolean {
  return object != null && object === (object as { window?: unknown }).window;
};

const isRenderer = function isRenderer(object: unknown): boolean {
  const wrapper = object as { jquery?: unknown; dxRenderer?: unknown } | null | undefined;
  return !!wrapper && !!(wrapper.jquery || wrapper.dxRenderer);
};

const isPromise = function isPromise(object: unknown): object is PromiseLike<unknown> {
  return !!object && isFunction((object as { then?: unknown }).then);
};

const isDeferred = function isDeferred(object: unknown): boolean {
  return !!object && isFunction((object as { done?: unknown }).done)
    && isFunction((object as { fail?: unknown }).fail);
};

const isEvent = function isEvent(object: unknown): boolean {
  return !!(object && (object as { preventDefault?: unknown }).preventDefault);
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

export default {
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
