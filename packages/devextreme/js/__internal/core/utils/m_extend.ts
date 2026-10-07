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

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- a void source is skipped
type EmptySource = null | undefined | void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an any source gives an any result
type MergedSource<T> = 0 extends 1 & T ? any : [T] extends [EmptySource]
  ? unknown
  : [Extract<T, EmptySource>] extends [never]
    ? NonNullable<T>
    : Partial<NonNullable<T>>;

type Merged<TSources extends readonly unknown[]> = TSources extends readonly [
  infer THead,
  ...infer TTail,
]
  ? MergedSource<THead> & Merged<TTail>
  : unknown;

interface Extend {
  <TTarget extends object, TSources extends unknown[]>(
    target: TTarget,
    ...sources: TSources
  ): TTarget & Merged<TSources>;
  <TTarget extends object, TSources extends unknown[]>(
    deep: true,
    target: TTarget,
    ...sources: TSources
  ): TTarget & Merged<TSources>;
  <TSources extends unknown[]>(
    deep: false | null | undefined,
    ...sources: TSources
  ): Merged<TSources>;
  <TSources extends unknown[]>(
    deep: boolean,
    target: null | undefined,
    ...sources: TSources
  ): Merged<TSources>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
  (...args: any[]): any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the overloads type the result
export const extend: Extend = function extend(...args: unknown[]): any {
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
