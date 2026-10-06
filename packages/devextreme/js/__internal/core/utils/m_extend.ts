import { isPlainObject } from '@js/core/utils/type';

type Dictionary = Record<string, unknown>;

export const extendFromObject = function extendFromObject(
  target: Dictionary | null | undefined,
  source: Dictionary | null | undefined,
  overrideExistingValues?: boolean,
): Dictionary {
  const result = target || {};
  // eslint-disable-next-line no-restricted-syntax -- the own keys are checked in the loop
  for (const prop in source) {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      const value = source[prop];
      if (!(prop in result) || overrideExistingValues) {
        result[prop] = value;
      }
    }
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers use its members
export const extend: any = function extend(...args: unknown[]) {
  let target = (args[0] || {}) as Dictionary | boolean;

  let i = 1;
  let deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = (args[1] || {}) as Dictionary;
    i += 1;
  }

  for (; i < args.length; i += 1) {
    const source = args[i] as Dictionary | null | undefined;
    if (source == null) {
      // eslint-disable-next-line no-continue -- the sources that are not set are skipped
      continue;
    }

    // eslint-disable-next-line no-restricted-syntax, guard-for-in -- inherited keys are copied too
    for (const key in source) {
      const targetValue = target[key];
      const sourceValue = source[key];
      let sourceValueIsArray = false;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the branches
      let clone: unknown;

      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        // eslint-disable-next-line no-continue -- the keys that are not copied are skipped
        continue;
      }

      if (deep && sourceValue && (isPlainObject(sourceValue)
              // eslint-disable-next-line no-cond-assign
              || (sourceValueIsArray = Array.isArray(sourceValue)))) {
        // eslint-disable-next-line max-depth -- the branch of the deep copy
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
