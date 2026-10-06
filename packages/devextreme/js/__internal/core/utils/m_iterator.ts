type EachCallback<TThis, TKey, TValue> = (this: TThis, key: TKey, value: TValue) => unknown;

interface Each {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- an empty literal is never[]
  (values: never[], callback: EachCallback<any, number, any>): never[];
  <T>(values: T[], callback: EachCallback<T, number, T>): T[];
  <T>(values: readonly T[], callback: EachCallback<T, number, T>): readonly T[];
  <T>(values: T[] | null | undefined, callback: EachCallback<T, number, T>): T[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the type of {} has no T
  <T = any>(values: Record<string, T>, callback: EachCallback<T, string, T>): Record<string, T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
  (values: any, callback: EachCallback<any, any, any>): any;
}

interface ReverseEach {
  <T>(array: ArrayLike<T> | null | undefined, callback: EachCallback<T, number, T>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
  (array: any, callback: EachCallback<any, any, any>): void;
}

interface MapValues {
  <TResult>(
    values: never[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- an empty literal is never[]
    callback: (value: any, index: number, array: never[]) => TResult,
  ): TResult[];
  <T, TResult>(
    values: readonly T[],
    callback: (value: T, index: number, array: readonly T[]) => TResult,
  ): TResult[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the type of {} has no T
  <T = any, TResult = unknown>(
    values: Record<string, T>,
    callback: (value: T, key: string) => TResult,
  ): TResult[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
  (values: any, callback: (value: any, key: any, array?: any) => any): any[];
}

const map: MapValues = (values, callback) => {
  if (Array.isArray(values)) {
    return values.map(callback);
  }

  const result: unknown[] = [];

  // eslint-disable-next-line no-restricted-syntax, guard-for-in -- inherited keys are mapped too
  for (const key in values) {
    result.push(callback(values[key], key));
  }

  return result;
};

const each: Each = (values, callback) => {
  if (!values) return undefined;

  if ('length' in values) {
    for (let i = 0; i < values.length; i += 1) {
      if (callback.call(values[i], i, values[i]) === false) {
        break;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in values) {
      if (callback.call(values[key], key, values[key]) === false) {
        break;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- the callers are not typed
  return values;
};

const reverseEach: ReverseEach = (array, callback) => {
  if (!array || !('length' in array) || array.length === 0) return;

  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (callback.call(array[i], i, array[i]) === false) {
      break;
    }
  }
};

export {
  each,
  map,
  reverseEach,
};
