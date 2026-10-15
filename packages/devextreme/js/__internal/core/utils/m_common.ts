import config from '@js/core/config';
import Guid from '@js/core/guid';
import { toComparable } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import {
  isDefined, isFunction, isObject, isString, type,
} from '@js/core/utils/type';

// @ts-expect-error new deferred
export const uiLayerInitialized = new Deferred();

export const ensureDefined = function ensureDefined<T>(
  value: T | null | undefined,
  defaultValue: T,
): T {
  return isDefined(value) ? value : defaultValue;
};

type TimerFunction = (
  callback: () => void,
  timeout: number,
) => ReturnType<typeof setTimeout>;

interface AsyncTask {
  promise: unknown;
  abort: () => void;
}

const hasDone = (
  value: unknown,
): value is DeferredObj<unknown> => !!(value as { done?: unknown }).done;

export const executeAsync = function executeAsync(
  this: unknown,
  action: (this: unknown) => unknown,
  context?: unknown,
  ...internal: [TimerFunction?]
): AsyncTask {
  // @ts-expect-error only void function can be called with new
  const deferred = new Deferred();
  const normalizedContext = context || this;
  const task = {
    promise: deferred.promise(),
    abort(): void {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- set below
      clearTimeout(timerId);
      deferred.rejectWith(normalizedContext);
    },
  };

  const callback = function callback(): void {
    const result = action.call(normalizedContext);

    if (result && hasDone(result) && isFunction(result.done)) {
      result.done(() => {
        deferred.resolveWith(normalizedContext);
      });
    } else {
      deferred.resolveWith(normalizedContext);
    }
  };

  const timerId = (internal[0] || setTimeout)(callback, typeof context === 'number' ? context : 0);

  return task;
};

type DeferredTask = () => unknown;

const delayedFuncs: DeferredTask[] = [];
const delayedNames: string[] = [];
const delayedDeferreds: DeferredObj<unknown>[] = [];
let executingName = undefined as string | undefined;

const deferExecute = function deferExecute(
  this: unknown,
  name: string,
  func: DeferredTask,
  deferred?: DeferredObj<unknown>,
): unknown {
  if (executingName && executingName !== name) {
    delayedFuncs.push(func);
    delayedNames.push(name);
    // @ts-expect-error only void function can be called with new
    const delayedDeferred: DeferredObj<unknown> = deferred || new Deferred();
    delayedDeferreds.push(delayedDeferred);
    return delayedDeferred;
  }
  const oldExecutingName = executingName;
  const currentDelayedCount = delayedDeferreds.length;

  executingName = name;
  let result = func();

  if (!result) {
    if (delayedDeferreds.length > currentDelayedCount) {
      result = when.apply(this, delayedDeferreds.slice(currentDelayedCount));
    } else if (deferred) {
      deferred.resolve();
    }
  }

  executingName = oldExecutingName;

  if (deferred && result && hasDone(result)) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- results are ignored
    result.done(deferred.resolve).fail(deferred.reject);
  }

  if (!executingName && delayedFuncs.length) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- the three call each other
    const deferFunc = delayedNames.shift() === 'render' ? deferRender : deferUpdate;
    // @ts-expect-error the queues hold an entry here
    deferFunc(delayedFuncs.shift(), delayedDeferreds.shift());
  }
  return result || when();
};

export const deferRender = function deferRender(
  func: DeferredTask,
  deferred?: DeferredObj<unknown>,
): unknown {
  return deferExecute('render', func, deferred);
};

export const deferUpdate = function deferUpdate(
  func: DeferredTask,
  deferred?: DeferredObj<unknown>,
): unknown {
  return deferExecute('update', func, deferred);
};

export const deferRenderer = function deferRenderer(
  func: (this: unknown) => unknown,
): (this: unknown) => unknown {
  return function render(this: unknown): unknown {
    return deferExecute('render', () => func.call(this));
  };
};

export const deferUpdater = function deferUpdater(
  func: (this: unknown) => unknown,
): (this: unknown) => unknown {
  return function update(this: unknown): unknown {
    return deferExecute('update', () => func.call(this));
  };
};

const match = function match(value: unknown, targetValue: unknown): boolean {
  if (Array.isArray(value) && Array.isArray(targetValue)) {
    let mismatch = false;

    each(value, (index, valueItem) => {
      if (valueItem !== targetValue[index]) {
        mismatch = true;
        return false;
      }
      return undefined;
    });

    if (mismatch) {
      return false;
    }

    return true;
  }

  if (value === targetValue) {
    return true;
  }

  return false;
};

type FilterMatch<TFilter> = { [TKey in keyof TFilter]?: unknown };

export function findBestMatches<TFilter extends object, TItem>(
  targetFilter: TFilter,
  items: readonly TItem[],
  mapFn: (item: TItem) => FilterMatch<TFilter>,
): TItem[];
export function findBestMatches<TFilter extends object, TItem extends FilterMatch<TFilter>>(
  targetFilter: TFilter,
  items: readonly TItem[],
): TItem[];
export function findBestMatches(
  targetFilter: Readonly<Record<string, unknown>>,
  items: readonly Readonly<Record<string, unknown>>[],
  mapFn?: (item: Readonly<Record<string, unknown>>) => Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>>[] {
  const bestMatches: Readonly<Record<string, unknown>>[] = [];
  let maxMatchCount = 0;

  each(items, (index, itemSrc) => {
    let matchCount = 0;
    const item = mapFn ? mapFn(itemSrc) : itemSrc;

    each(targetFilter, (paramName, targetValue) => {
      const value = item[paramName];

      if (value === undefined) {
        return undefined;
      }

      if (match(value, targetValue)) {
        matchCount += 1;
        return undefined;
      }
      matchCount = -1;
      return false;
    });

    if (matchCount < maxMatchCount) {
      return;
    }
    if (matchCount > maxMatchCount) {
      bestMatches.length = 0;
      maxMatchCount = matchCount;
    }
    bestMatches.push(itemSrc);
  });

  return bestMatches;
}

interface PairObject {
  x?: unknown;
  y?: unknown;
  h?: unknown;
  v?: unknown;
}

export const splitPair = function splitPair(raw: unknown): unknown[] | null {
  switch (type(raw)) {
    case 'string':
      return (raw as string).split(/\s+/, 2);
    case 'object': {
      const pair = raw as PairObject;
      return [pair.x ?? pair.h, pair.y ?? pair.v];
    }
    case 'number':
      return [raw];
    case 'array':
      return raw as unknown[];
    default:
      return null;
  }
};

export const normalizeKey = function normalizeKey(id: string | { toString: () => string }): string {
  let key = isString(id) ? id : id.toString();
  const arr = key.match(/[^a-zA-Z0-9_]/g);

  if (arr) {
    each(arr, (_, sign) => {
      key = key.replace(sign, `__${sign.charCodeAt(0)}__`);
    });
  }
  return key;
};

export const denormalizeKey = function denormalizeKey(key: string): string {
  let result = key;
  const arr = result.match(/__\d+__/g);

  if (arr) {
    arr.forEach((char) => {
      const charCode = parseInt(char.replace('__', ''), 10);

      result = result.replace(char, String.fromCharCode(charCode));
    });
  }

  return result;
};

export const pairToObject = function pairToObject(
  raw: unknown,
  preventRound?: unknown,
): { h: number; v: number } {
  const pair = splitPair(raw);
  // @ts-expect-error parseFloat and parseInt convert the part to a string
  let h = preventRound ? parseFloat(pair?.[0]) : parseInt(pair?.[0], 10);
  // @ts-expect-error parseFloat and parseInt convert the part to a string
  let v = preventRound ? parseFloat(pair?.[1]) : parseInt(pair?.[1], 10);

  if (!Number.isFinite(h)) {
    h = 0;
  }
  if (!Number.isFinite(v)) {
    v = h;
  }

  return { h, v };
};

export const getKeyHash = function getKeyHash(key: unknown): unknown {
  if (key instanceof Guid) {
    return key.toString();
  } if (isObject(key) || Array.isArray(key)) {
    try {
      const keyHash = JSON.stringify(key);
      return keyHash === '{}' ? key : keyHash;
    } catch (e) {
      return key;
    }
  }

  return key;
};

export const escapeRegExp = function escapeRegExp(string: string): string {
  return string.replace(/[[\]{}\-()*+?.\\^$|\s]/g, '\\$&');
};

export function applyServerDecimalSeparator(
  value: string | number | boolean | bigint | object,
): string;
export function applyServerDecimalSeparator<T extends null | undefined>(value: T): T;
export function applyServerDecimalSeparator(value: unknown): unknown;
export function applyServerDecimalSeparator(value: unknown): unknown {
  const separator = config().serverDecimalSeparator;
  if (isDefined(value)) {
    // @ts-expect-error the default config sets the separator
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- a number or a string
    return value.toString().replace('.', separator);
  }
  return value;
}

export const noop = function noop(): void {};
export const asyncNoop = function asyncNoop(): unknown {
  // @ts-expect-error only void function can be called with new
  return new Deferred().resolve().promise();
};

export const grep = function grep<T>(
  elements: ArrayLike<T>,
  checkFunction: (element: T, index: number) => unknown,
  invert?: boolean,
): T[] {
  const result: T[] = [];
  const expectedCheck = !invert;

  for (let i = 0; i < elements.length; i += 1) {
    const check = !!checkFunction(elements[i], i);

    if (check === expectedCheck) {
      result.push(elements[i]);
    }
  }

  return result;
};

const compareArrays = (array1, array2, depth, options) => {
  if (array1.length !== array2.length) {
    return false;
  }

  return !array1.some((item, idx) => !compareByValue(item, array2[idx], depth + 1, {
    ...options,
    strict: true,
  }));
};

const compareObjects = (object1, object2, depth, options) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  const keys2Set = new Set(keys2);
  return !keys1.some((key) => !keys2Set.has(key) || !compareByValue(object1[key], object2[key], depth + 1, options));
};

const DEFAULT_EQUAL_BY_VALUE_OPTS = {
  maxDepth: 3,
  strict: true,
};
const compareByValue = (value1, value2, depth, options) => {
  const { strict, maxDepth } = options;
  const comparable1 = toComparable(value1, true);
  const comparable2 = toComparable(value2, true);

  const comparisonResult = strict
    ? comparable1 === comparable2
  // eslint-disable-next-line eqeqeq
    : comparable1 == comparable2;

  switch (true) {
    case comparisonResult:
    case depth >= maxDepth:
      return true;
    case isObject(comparable1) && isObject(comparable2):
      return compareObjects(comparable1, comparable2, depth, options);
    case Array.isArray(comparable1) && Array.isArray(comparable2):
      return compareArrays(comparable1, comparable2, depth, options);
    default:
      return false;
  }
};

export const equalByValue = (value1, value2, options = DEFAULT_EQUAL_BY_VALUE_OPTS) => {
  const compareOptions = { ...DEFAULT_EQUAL_BY_VALUE_OPTS, ...options };
  return compareByValue(value1, value2, 0, compareOptions);
};

export default {
  ensureDefined,
  executeAsync,
  deferRender,
  deferUpdate,
  deferRenderer,
  deferUpdater,
  findBestMatches,
  splitPair,
  normalizeKey,
  denormalizeKey,
  pairToObject,
  getKeyHash,
  escapeRegExp,
  applyServerDecimalSeparator,
  noop,
  asyncNoop,
  grep,
  equalByValue,
};
