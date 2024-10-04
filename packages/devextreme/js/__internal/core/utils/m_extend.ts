import { isPlainObject } from '@js/core/utils/type';

export const extendFromObject = function (target, source, overrideExistingValues) {
  target = target || {};
  Object.keys(source).forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      const value = source[prop];
      if (!(prop in target) || overrideExistingValues) {
        target[prop] = value;
      }
    }
  });
  return target;
};

export const extend = function (target, ...args: any[]) {
  target = target || {};

  let i = 0;
  let deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = args[0] || {};
    i++;
  }

  for (; i < args.length; i++) {
    const source = args[i];
    if (source == null) {
      continue;
    }

    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];
      let sourceValueIsArray = false;
      let clone;

      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        return;
      }

      if (deep && sourceValue && (isPlainObject(sourceValue)
          // eslint-disable-next-line no-cond-assign
          || (sourceValueIsArray = Array.isArray(sourceValue)))) {
        if (sourceValueIsArray) {
          clone = targetValue && Array.isArray(targetValue) ? targetValue : [];
        } else {
          clone = targetValue && isPlainObject(targetValue) ? targetValue : {};
        }

        target[key] = extend(deep, clone, sourceValue);
      } else if (sourceValue !== undefined) {
        target[key] = sourceValue;
      }
    });
  }

  return target;
};
