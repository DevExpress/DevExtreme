import type { dxElementWrapper } from '@js/core/renderer';

type EachCallback<TValue, TKey> = (this: TValue, key: TKey, value: TValue) => unknown;

type IsAny<T> = 0 extends 1 & T ? true : false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any values give any items
type Item<TValues> = IsAny<TValues> extends true ? any
  : TValues extends dxElementWrapper ? Element
    : TValues extends ArrayLike<infer TItem> ? TItem : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the keys of any values are not known
type Index<TValues> = IsAny<TValues> extends true ? any : number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- as Object.values, an object without keys gives any values
type Value<TValues> = [keyof TValues] extends [never] ? any
  : { [TKey in keyof TValues]-?: TValues[TKey] }[keyof TValues];

type Key<TValues> = [keyof TValues] extends [never] ? string : string & keyof TValues;

type Each<TValues> = TValues extends null | undefined ? undefined : TValues;

type Collection = Readonly<Record<string, unknown>> | ArrayLike<unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the overloads type the callback
type Callback = (this: any, key: any, value: any, array?: any) => unknown;

const hasLength = (values: object): values is ArrayLike<unknown> => 'length' in values;

function map<TItem, TResult>(
  values: readonly TItem[],
  callback: (value: TItem, index: number, array: readonly TItem[]) => TResult,
): TResult[];
function map<TValues extends object, TResult>(
  values: TValues | null | undefined,
  callback: (value: Value<TValues>, key: Key<TValues>) => TResult,
): TResult[];
function map(values: Collection | null | undefined, callback: Callback): unknown[] {
  if (Array.isArray(values)) {
    return values.map(callback);
  }

  const result: unknown[] = [];

  // eslint-disable-next-line no-restricted-syntax, guard-for-in, @typescript-eslint/no-for-in-array -- inherited keys are mapped too
  for (const key in values) {
    result.push(callback(values[key], key));
  }

  return result;
}

function each<TValues extends ArrayLike<unknown> | dxElementWrapper | null | undefined>(
  values: TValues,
  callback: EachCallback<Item<NonNullable<TValues>>, Index<TValues>>,
): Each<TValues>;
function each<TValues extends object | null | undefined>(
  values: TValues,
  // eslint-disable-next-line @typescript-eslint/unified-signatures -- a union of callbacks has no contextual parameter types
  callback: EachCallback<Value<NonNullable<TValues>>, Key<NonNullable<TValues>>>,
): Each<TValues>;
function each(values: Collection | null | undefined, callback: Callback): unknown {
  if (!values) return undefined;

  if (hasLength(values)) {
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

  return values;
}

function reverseEach<TItem>(
  array: ArrayLike<TItem> | null | undefined,
  callback: EachCallback<TItem, number>,
): void;
function reverseEach(array: ArrayLike<unknown> | null | undefined, callback: Callback): void {
  if (!array || !('length' in array) || array.length === 0) return;

  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (callback.call(array[i], i, array[i]) === false) {
      break;
    }
  }
}

export {
  each,
  map,
  reverseEach,
};
