import { isPlainObject } from '@js/core/utils/type';

export const extendFromObject = function (target, source, overrideExistingValues) {
  target = target || {};
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in source) {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      const value = source[prop];
      if (!(prop in target) || overrideExistingValues) {
        target[prop] = value;
      }
    }
  }
  return target;
};

export const extend = function (...args) {
  let target = args[0] || {};

  let i = 1;
  let deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = args[1] || {};
    i++;
  }

  for (; i < args.length; i++) {
    const source = args[i];
    if (source == null) {
      continue;
    }

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in source) {
      const targetValue = target[key];
      const sourceValue = source[key];
      let sourceValueIsArray = false;
      let clone;

      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        continue;
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
    }
  }

  return target;
};
