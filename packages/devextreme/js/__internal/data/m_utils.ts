/* eslint-disable spellcheck/spell-checker */
import domAdapter from '@js/core/dom_adapter';
import { equalByValue } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { map } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { isFunction } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

const ready = readyCallbacks.add;

export const XHR_ERROR_UNLOAD = 'DEVEXTREME_XHR_ERROR_UNLOAD';

export const normalizeBinaryCriterion = function (crit) {
  return [
    crit[0],
    crit.length < 3 ? '=' : String(crit[1]).toLowerCase(),
    crit.length < 2 ? true : crit[crit.length - 1],
  ];
};

export const normalizeSortingInfo = function (info) {
  if (!Array.isArray(info)) {
    info = [info];
  }

  return map(info, (i) => {
    const result = {
      selector: isFunction(i) || typeof i === 'string' ? i : i.getter || i.field || i.selector,
      desc: !!(i.desc || String(i.dir).charAt(0).toLowerCase() === 'd'),
    };
    if (i.compare) {
      // @ts-expect-error
      result.compare = i.compare;
    }
    return result;
  });
};

export const errorMessageFromXhr = (function () {
  const textStatusMessages = {
    timeout: 'Network connection timeout',
    error: 'Unspecified network error',
    parsererror: 'Unexpected server response',
  };

  /// #DEBUG
  const textStatusDetails = {
    timeout: 'possible causes: the remote host is not accessible, overloaded or is not included into the domain white-list when being run in the native container',
    error: 'if the remote host is located on another domain, make sure it properly supports cross-origin resource sharing (CORS), or use the JSONP approach instead',
    parsererror: 'the remote host did not respond with valid JSON data',
  };
  /// #ENDDEBUG

  const explainTextStatus = function (textStatus) {
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
  let unloading;
  ready(() => {
    const window = getWindow();
    // @ts-expect-error
    domAdapter.listen(window, 'beforeunload', () => { unloading = true; });
  });

  return function (xhr, textStatus) {
    if (unloading) {
      return XHR_ERROR_UNLOAD;
    }
    if (xhr.status < 400) {
      return explainTextStatus(textStatus);
    }
    return xhr.statusText;
  };
}());

export const aggregators = {
  count: {
    seed: 0,
    step(count) { return 1 + count; },
  },
  sum: {
    seed: 0,
    step(sum, item) { return sum + item; },
  },
  min: {
    step(min, item) { return item < min ? item : min; },
  },
  max: {
    step(max, item) { return item > max ? item : max; },
  },
  avg: {
    seed: [0, 0],
    step(pair, value) {
      return [pair[0] + value, pair[1] + 1];
    },
    finalize(pair) {
      return pair[1] ? pair[0] / pair[1] : NaN;
    },
  },
};

export const processRequestResultLock = (function () {
  let lockCount = 0;
  let lockDeferred;

  const obtain = function () {
    if (lockCount === 0) {
      // @ts-expect-error
      lockDeferred = new Deferred();
    }
    lockCount++;
  };

  const release = function () {
    lockCount--;
    if (lockCount < 1) {
      lockDeferred.resolve();
    }
  };

  const promise = function () {
    // @ts-expect-error
    const deferred = lockCount === 0 ? new Deferred().resolve() : lockDeferred;
    return deferred.promise();
  };

  const reset = function () {
    lockCount = 0;
    if (lockDeferred) {
      lockDeferred.resolve();
    }
  };

  return {
    obtain,
    release,
    promise,
    reset,
  };
}());

export function isDisjunctiveOperator(condition) {
  return /^(or|\|\||\|)$/i.test(condition);
}

export function isConjunctiveOperator(condition) {
  return /^(and|&&|&)$/i.test(condition);
}

export const keysEqual = function (keyExpr, key1, key2) {
  if (Array.isArray(keyExpr)) {
    const names = map(key1, (v, k) => k);
    let name;
    for (let i = 0; i < names.length; i++) {
      name = names[i];
      if (!equalByValue(key1[name], key2[name], { strict: false })) {
        return false;
      }
    }
    return true;
  }

  return equalByValue(key1, key2, { strict: false });
};

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const base64_encode = function (input) {
  if (!Array.isArray(input)) {
    input = stringToByteArray(String(input));
  }

  let result = '';

  function getBase64Char(index) {
    return BASE64_CHARS.charAt(index);
  }

  for (let i = 0; i < input.length; i += 3) {
    const octet1 = input[i];
    const octet2 = input[i + 1];
    const octet3 = input[i + 2];

    result += map(
      [
        octet1 >> 2,
        ((octet1 & 3) << 4) | octet2 >> 4,
        isNaN(octet2) ? 64 : ((octet2 & 15) << 2) | octet3 >> 6,
        isNaN(octet3) ? 64 : octet3 & 63,
      ],
      getBase64Char,
    ).join('');
  }

  return result;
};

function stringToByteArray(str) {
  const bytes: number[] = [];
  let code: number;
  let i;

  for (i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);

    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 + (code >> 6), 128 + (code & 63));
    } else if (code < 65536) {
      bytes.push(224 + (code >> 12), 128 + ((code >> 6) & 63), 128 + (code & 63));
    } else if (code < 2097152) {
      bytes.push(240 + (code >> 18), 128 + ((code >> 12) & 63), 128 + ((code >> 6) & 63), 128 + (code & 63));
    }
  }
  return bytes;
}

export const isUnaryOperation = function (crit) {
  return crit[0] === '!' && Array.isArray(crit[1]);
};

const isGroupOperator = function (value) {
  return value === 'and' || value === 'or';
};

export const isUniformEqualsByOr = function (crit) {
  if (crit.length > 2 && Array.isArray(crit[0]) && crit[1] === 'or' && typeof crit[0][0] === 'string' && crit[0][1] === '=') {
    const [prop] = crit[0];
    return !crit.find((el, i) => (i % 2 !== 0 ? el !== 'or'
      : !Array.isArray(el) || el.length !== 3 || el[0] !== prop || el[1] !== '='));
  }
  return false;
};

export const isGroupCriterion = function (crit) {
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

export const trivialPromise = function () {
  // @ts-expect-error
  const d = new Deferred();
  return d.resolve.apply(d, arguments).promise();
};

export const rejectedPromise = function () {
  // @ts-expect-error
  const d = new Deferred();
  return d.reject.apply(d, arguments).promise();
};

function throttle(func, timeout) {
  let timeoutId;
  return function () {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        func.call(this);
      }, isFunction(timeout) ? timeout() : timeout);
    }
    return timeoutId;
  };
}

export function throttleChanges(func, timeout) {
  let cache = [];
  const throttled = throttle(function () {
    func.call(this, cache);
    cache = [];
  }, timeout);

  return function (changes) {
    if (Array.isArray(changes)) {
      // @ts-expect-error
      cache.push(...changes);
    }
    // @ts-expect-error
    return throttled.call(this, cache);
  };
}
