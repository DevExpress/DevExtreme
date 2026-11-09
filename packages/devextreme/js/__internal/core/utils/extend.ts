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

type IsAny<T> = 0 extends 1 & T ? true : false;

type Source<T> = IsAny<T> extends true
  ? T
  : unknown extends T
    ? Record<string, unknown>
    : [T] extends [EmptySource]
      ? Record<never, never>
      : [Extract<T, EmptySource>] extends [never]
        ? T
        : NonNullable<T> extends readonly unknown[]
          ? NonNullable<T>
          : Partial<NonNullable<T>>;

type Leaf = readonly unknown[] | ((...args: never[]) => unknown) | Date | RegExp;

type IsNestedObject<T> = [T] extends [Leaf] ? false : [T] extends [object] ? true : false;

type AssignedValue<TTarget, TSource, TKey extends PropertyKey> = undefined extends TSource
  ? (TKey extends keyof TTarget ? TTarget[TKey] : never) | Exclude<TSource, undefined>
  : TSource;

type MergedArray<TTarget, TSource> = TTarget extends readonly (infer TTargetItem)[]
  ? TSource extends readonly (infer TSourceItem)[]
    ? (TTargetItem | TSourceItem)[]
    : never
  : never;

type KnownKeys<T> = keyof {
  [TKey in keyof T as string extends TKey ? never : number extends TKey ? never : TKey]: unknown;
};

type KeptValues<TTarget, TSource> = {
  [TKey in keyof TTarget as TKey extends KnownKeys<TSource> ? never : TKey]: TTarget[TKey];
};

type AssignObject<TTarget, TSource> = KeptValues<TTarget, TSource> & {
  [TKey in keyof TSource as TKey extends keyof TTarget ? TKey : never]-?:
  AssignedValue<TTarget, TSource[TKey], TKey>;
} & {
  [TKey in keyof TSource as TKey extends keyof TTarget ? never : TKey]: TSource[TKey];
};

type Assign<TTarget, TSource> = IsAny<TTarget> extends true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any target, any result
  ? any
  : IsAny<TSource> extends true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any source, any result
    ? any
    : TTarget extends unknown
      ? TSource extends unknown
        ? [keyof TTarget] extends [never]
          ? TSource & object
          : [MergedArray<TTarget, TSource>] extends [never]
            ? AssignObject<TTarget, TSource>
            : MergedArray<TTarget, TSource>
        : never
      : never;

type NestedValue<TTarget, TSource> = [MergedArray<TTarget, TSource>] extends [never]
  ? IsNestedObject<TTarget> extends true
    ? IsNestedObject<TSource> extends true
      ? DeepAssign<TTarget, TSource>
      : TSource
    : TSource
  : MergedArray<TTarget, TSource>;

type DeepValue<TTarget, TSource> = NestedValue<NonNullable<TTarget>, NonNullable<TSource>>
  | ([Extract<TTarget, null | undefined>] extends [never] ? never : NonNullable<TSource>)
  | Extract<TSource, null | undefined>;

type DeepAssignObject<TTarget, TSource> = KeptValues<TTarget, TSource> & {
  [TKey in keyof TSource as TKey extends keyof TTarget ? TKey : never]-?:
  TKey extends keyof TTarget
    ? AssignedValue<TTarget, DeepValue<TTarget[TKey], TSource[TKey]>, TKey>
    : never;
} & {
  [TKey in keyof TSource as TKey extends keyof TTarget ? never : TKey]: TSource[TKey];
};

type DeepAssign<TTarget, TSource> = IsAny<TTarget> extends true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any target, any result
  ? any
  : IsAny<TSource> extends true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any source, any result
    ? any
    : TTarget extends unknown
      ? TSource extends unknown
        ? [keyof TTarget] extends [never]
          ? TSource & object
          : [MergedArray<TTarget, TSource>] extends [never]
            ? DeepAssignObject<TTarget, TSource>
            : MergedArray<TTarget, TSource>
        : never
      : never;

type Extended<TTarget, TSources extends readonly unknown[]> = TSources extends readonly [
  infer THead,
  ...infer TTail,
]
  ? Extended<Assign<TTarget, Source<THead>>, TTail>
  : TTarget;

type DeepExtended<TTarget, TSources extends readonly unknown[]> = TSources extends readonly [
  infer THead,
  ...infer TTail,
]
  ? DeepExtended<DeepAssign<TTarget, Source<THead>>, TTail>
  : TTarget;

type Target = object | null | undefined;

type EmptyTarget = Record<string, never>;

type Patch<TSource> = Partial<NoInfer<TSource>> | null | undefined;

interface Extend {
  (): Record<never, never>;
  <TSource extends object>(
    deep: true,
    target: EmptyTarget,
    source: TSource,
    ...patches: Patch<TSource>[]
  ): TSource;
  <TSource extends object>(
    target: EmptyTarget,
    source: TSource,
    ...patches: Patch<TSource>[]
  ): TSource;
  <TTarget extends Target, TSources extends unknown[]>(
    deep: true,
    target?: TTarget,
    ...sources: TSources
  ): DeepExtended<Source<TTarget>, TSources>;
  <TTarget extends Target | false, TSources extends unknown[]>(
    target: TTarget,
    ...sources: TSources
  ): Extended<Source<Exclude<TTarget, false>>, TSources>;
  <TTarget extends Target, TSources extends unknown[]>(
    deep: boolean,
    target: TTarget,
    ...sources: TSources
  ): Extended<Source<TTarget>, TSources> | DeepExtended<Source<TTarget>, TSources>;
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
