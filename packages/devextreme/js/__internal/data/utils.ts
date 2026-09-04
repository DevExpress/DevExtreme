/* eslint-disable spellcheck/spell-checker */
import domAdapter from '@js/core/dom_adapter';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { map } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { isFunction, isObject, isString } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

const ready = readyCallbacks.add;

export const XHR_ERROR_UNLOAD = 'DEVEXTREME_XHR_ERROR_UNLOAD';

export type BinaryCriterion = [unknown, string, unknown];

export const normalizeBinaryCriterion = function (crit: unknown[]): BinaryCriterion {
  return [
    crit[0],
    crit.length < 3 ? '=' : String(crit[1]).toLowerCase(),
    crit.length < 2 ? true : crit[crit.length - 1],
  ];
};

export type SortingSelector = string | Function;

export interface SortingInfo {
  selector: SortingSelector | undefined;
  desc: boolean;
  compare?: unknown;
  isExpanded?: boolean;
  groupInterval?: unknown;
}

interface SortingDescriptor {
  getter?: SortingSelector;
  field?: SortingSelector;
  selector?: SortingSelector;
  desc?: unknown;
  dir?: unknown;
  compare?: unknown;
}

export const normalizeSortingInfo = function (info: unknown): SortingInfo[] {
  const infoArray: unknown[] = Array.isArray(info) ? info : [info];

  return infoArray.map((item: unknown): SortingInfo => {
    const descriptor: SortingDescriptor = isObject(item) ? item : {};
    const result: SortingInfo = {
      selector: isFunction(item) || isString(item)
        ? item
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        : descriptor.getter || descriptor.field || descriptor.selector,
      desc: !!(descriptor.desc || String(descriptor.dir).charAt(0).toLowerCase() === 'd'),
    };
    if (descriptor.compare) {
      result.compare = descriptor.compare;
    }
    return result;
  });
};

export const errorMessageFromXhr = (function () {
  const textStatusMessages: Record<string, string> = {
    timeout: 'Network connection timeout',
    error: 'Unspecified network error',
    parsererror: 'Unexpected server response',
  };

  /// #DEBUG
  const textStatusDetails: Record<string, string> = {
    timeout: 'possible causes: the remote host is not accessible, overloaded or is not included into the domain white-list when being run in the native container',
    error: 'if the remote host is located on another domain, make sure it properly supports cross-origin resource sharing (CORS), or use the JSONP approach instead',
    parsererror: 'the remote host did not respond with valid JSON data',
  };
  /// #ENDDEBUG

  const explainTextStatus = function (textStatus: string): string {
    let result = textStatusMessages[textStatus];

    if (!result) {
      return textStatus;
    }

    /// #DEBUG
    result += ` (${textStatusDetails[textStatus]})`;
    /// #ENDDEBUG

    return result;
  };

  // T542570, https://stackoverflow.com/a/18170879
  let unloading = false;
  ready(() => {
    const window = getWindow();
    domAdapter.listen(window, 'beforeunload', () => { unloading = true; });
  });

  return function (xhr: unknown, textStatus: unknown): string {
    if (unloading) {
      return XHR_ERROR_UNLOAD;
    }

    const status = isObject(xhr) && 'status' in xhr ? Number(xhr.status) : NaN;

    if (status < 400) {
      return explainTextStatus(String(textStatus));
    }

    return isObject(xhr) && 'statusText' in xhr ? String(xhr.statusText) : '';
  };
}());

type AggregatableValue = number | string | Date;

export const aggregators = {
  count: {
    seed: 0,
    step(count: number): number { return 1 + count; },
  },
  sum: {
    seed: 0,
    step(sum: number, item: number): number { return sum + item; },
  },
  min: {
    step(min: AggregatableValue, item: AggregatableValue): AggregatableValue {
      return item < min ? item : min;
    },
  },
  max: {
    step(max: AggregatableValue, item: AggregatableValue): AggregatableValue {
      return item > max ? item : max;
    },
  },
  avg: {
    seed: [0, 0],
    step(pair: [number, number], value: number): [number, number] {
      return [pair[0] + value, pair[1] + 1];
    },
    finalize(pair: [number, number]): number {
      return pair[1] ? pair[0] / pair[1] : NaN;
    },
  },
};

interface RequestResultLock {
  obtain: () => void;
  release: () => void;
  promise: () => DeferredObj<unknown>;
  reset: () => void;
}

export const processRequestResultLock: RequestResultLock = (function (): RequestResultLock {
  let lockCount = 0;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let lockDeferred: DeferredObj<unknown> | undefined;

  const obtain = function (): void {
    if (lockCount === 0) {
      lockDeferred = Deferred<unknown>();
    }
    lockCount += 1;
  };

  const release = function (): void {
    lockCount -= 1;
    if (lockCount < 1) {
      lockDeferred?.resolve();
    }
  };

  const promise = function (): DeferredObj<unknown> {
    return lockCount === 0 || !lockDeferred
      ? Deferred<unknown>().resolve()
      : lockDeferred;
  };

  const reset = function (): void {
    lockCount = 0;
    lockDeferred?.resolve();
  };

  return {
    obtain,
    release,
    promise,
    reset,
  };
}());

export function isDisjunctiveOperator(condition: unknown): boolean {
  return /^(or|\|\||\|)$/i.test(String(condition));
}

export function isConjunctiveOperator(condition: unknown): boolean {
  return /^(and|&&|&)$/i.test(String(condition));
}

const isRecord = (value: unknown): value is Record<string, unknown> => isObject(value);

export const keysEqual = function (keyExpr: unknown, key1: unknown, key2: unknown): boolean {
  if (Array.isArray(keyExpr)) {
    const names: string[] = map(key1, (value: unknown, name: string): string => name);
    const values1: Record<string, unknown> = isRecord(key1) ? key1 : {};
    const values2: Record<string, unknown> = isRecord(key2) ? key2 : {};

    for (const name of names) {
      if (!equalByValue(values1[name], values2[name], { strict: false })) {
        return false;
      }
    }
    return true;
  }

  return equalByValue(key1, key2, { strict: false });
};

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/* eslint-disable no-bitwise */

function stringToByteArray(str: string): number[] {
  const bytes: number[] = [];

  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);

    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 + (code >> 6), 128 + (code & 63));
    } else if (code < 65536) {
      bytes.push(224 + (code >> 12), 128 + ((code >> 6) & 63), 128 + (code & 63));
    } else if (code < 2097152) {
      bytes.push(
        240 + (code >> 18),
        128 + ((code >> 12) & 63),
        128 + ((code >> 6) & 63),
        128 + (code & 63),
      );
    }
  }
  return bytes;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const base64_encode = function (input: string | number[]): string {
  const bytes: number[] = Array.isArray(input) ? input : stringToByteArray(String(input));

  let result = '';

  function getBase64Char(index: number): string {
    return BASE64_CHARS.charAt(index);
  }

  for (let i = 0; i < bytes.length; i += 3) {
    const octet1 = bytes[i];
    const octet2 = bytes[i + 1];
    const octet3 = bytes[i + 2];

    result += [
      octet1 >> 2,
      ((octet1 & 3) << 4) | (octet2 >> 4),
      isNaN(octet2) ? 64 : ((octet2 & 15) << 2) | (octet3 >> 6),
      isNaN(octet3) ? 64 : octet3 & 63,
    ].map(getBase64Char).join('');
  }

  return result;
};

/* eslint-enable no-bitwise */

export const isUnaryOperation = function (crit: unknown): boolean {
  return Array.isArray(crit) && crit[0] === '!' && Array.isArray(crit[1]);
};

const isGroupOperator = function (value: unknown): boolean {
  return value === 'and' || value === 'or';
};

export const isUniformEqualsByOr = function (crit: unknown[]): boolean {
  if (crit.length > 2 && Array.isArray(crit[0]) && crit[1] === 'or' && typeof crit[0][0] === 'string' && crit[0][1] === '=') {
    const [prop] = crit[0];
    return !crit.find((el, i) => (i % 2 !== 0 ? el !== 'or'
      : !Array.isArray(el) || el.length !== 3 || el[0] !== prop || el[1] !== '='));
  }
  return false;
};

export const isGroupCriterion = function (crit: unknown): boolean {
  if (!Array.isArray(crit)) {
    return false;
  }

  const first = crit[0];
  const second = crit[1];

  if (Array.isArray(first)) {
    return true;
  }
  if (isFunction(first)) {
    if (Array.isArray(second) || isFunction(second) || isGroupOperator(second)) {
      return true;
    }
  }

  return false;
};

export const trivialPromise = function <T>(...args: T[]): DeferredObj<T> {
  const d = Deferred<T>();
  // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
  return d.resolve(...args).promise();
};

export const rejectedPromise = function <T>(...args: T[]): DeferredObj<T> {
  const d = Deferred<T>();
  // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
  return d.reject(...args).promise();
};

type ThrottleTimeout = number | (() => number);

type TimeoutId = ReturnType<typeof setTimeout>;

function throttle(
  func: (this: unknown) => void,
  timeout: ThrottleTimeout,
): (this: unknown) => TimeoutId | undefined {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let timeoutId: TimeoutId | undefined;
  return function (this: unknown): TimeoutId | undefined {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        func.call(this);
      }, isFunction(timeout) ? timeout() : timeout);
    }
    return timeoutId;
  };
}

export function throttleChanges<T>(
  func: (this: unknown, changes: T[]) => void,
  timeout: ThrottleTimeout,
): (this: unknown, changes: T[]) => TimeoutId | undefined {
  let cache: T[] = [];
  const throttled = throttle(function (this: unknown): void {
    func.call(this, cache);
    cache = [];
  }, timeout);

  return function (this: unknown, changes: T[]): TimeoutId | undefined {
    if (Array.isArray(changes)) {
      cache.push(...changes);
    }
    return throttled.call(this);
  };
}
