import { isFunction } from '../core/utils/type';
import domAdapter from '../core/dom_adapter';
import { add as ready } from '../core/utils/ready_callbacks';
import { getWindow } from '../core/utils/window';
import { map } from '../core/utils/iterator';
import { toComparable } from '../core/utils/data';
import { Deferred } from '../core/utils/deferred';
import typeUtils from '../core/utils/type';

const XHR_ERROR_UNLOAD = 'DEVEXTREME_XHR_ERROR_UNLOAD';

const normalizeBinaryCriterion = function(crit) {
    return [
        crit[0],
        crit.length < 3 ? '=' : String(crit[1]).toLowerCase(),
        crit.length < 2 ? true : crit[crit.length - 1]
    ];
};

const normalizeSortingInfo = function(info) {
    if(!Array.isArray(info)) {
        info = [info];
    }

    return map(info, function(i) {
        const result = {
            selector: (isFunction(i) || typeof i === 'string') ? i : (i.getter || i.field || i.selector),
            desc: !!(i.desc || String(i.dir).charAt(0).toLowerCase() === 'd')
        };
        if(i.compare) {
            result.compare = i.compare;
        }
        return result;
    });
};

const errorMessageFromXhr = (function() {
    const textStatusMessages = {
        'timeout': 'Network connection timeout',
        'error': 'Unspecified network error',
        'parsererror': 'Unexpected server response'
    };

    ///#DEBUG
    const textStatusDetails = {
        'timeout': 'possible causes: the remote host is not accessible, overloaded or is not included into the domain white-list when being run in the native container',
        'error': 'if the remote host is located on another domain, make sure it properly supports cross-origin resource sharing (CORS), or use the JSONP approach instead',
        'parsererror': 'the remote host did not respond with valid JSON data'
    };
    ///#ENDDEBUG

    const explainTextStatus = function(textStatus) {
        let result = textStatusMessages[textStatus];

        if(!result) {
            return textStatus;
        }

        ///#DEBUG
        result += ' (' + textStatusDetails[textStatus] + ')';
        ///#ENDDEBUG

        return result;
    };

    // T542570, https://stackoverflow.com/a/18170879
    let unloading;
    ready(function() {
        const window = getWindow();
        domAdapter.listen(window, 'beforeunload', function() { unloading = true; });
    });

    return function(xhr, textStatus) {
        if(unloading) {
            return XHR_ERROR_UNLOAD;
        }
        if(xhr.status < 400) {
            return explainTextStatus(textStatus);
        }
        return xhr.statusText;
    };
})();

const aggregators = {
    count: {
        seed: 0,
        step: function(count) { return 1 + count; }
    },
    sum: {
        seed: 0,
        step: function(sum, item) { return sum + item; }
    },
    min: {
        step: function(min, item) { return item < min ? item : min; }
    },
    max: {
        step: function(max, item) { return item > max ? item : max; }
    },
    avg: {
        seed: [0, 0],
        step: function(pair, value) {
            return [pair[0] + value, pair[1] + 1];
        },
        finalize: function(pair) {
            return pair[1] ? pair[0] / pair[1] : NaN;
        }
    }
};

const processRequestResultLock = (function() {
    let lockCount = 0;
    let lockDeferred;

    const obtain = function() {
        if(lockCount === 0) {
            lockDeferred = new Deferred();
        }
        lockCount++;
    };

    const release = function() {
        lockCount--;
        if(lockCount < 1) {
            lockDeferred.resolve();
        }
    };

    const promise = function() {
        const deferred = lockCount === 0 ? new Deferred().resolve() : lockDeferred;
        return deferred.promise();
    };

    const reset = function() {
        lockCount = 0;
        if(lockDeferred) {
            lockDeferred.resolve();
        }
    };

    return {
        obtain: obtain,
        release: release,
        promise: promise,
        reset: reset
    };
})();

function isDisjunctiveOperator(condition) {
    return /^(or|\|\||\|)$/i.test(condition);
}

function isConjunctiveOperator(condition) {
    return /^(and|&&|&)$/i.test(condition);
}

const keysEqual = function(keyExpr, key1, key2) {
    if(Array.isArray(keyExpr)) {
        const names = map(key1, function(v, k) { return k; });
        let name;
        for(let i = 0; i < names.length; i++) {
            name = names[i];
            // eslint-disable-next-line eqeqeq
            if(toComparable(key1[name], true) != toComparable(key2[name], true)) {
                return false;
            }
        }
        return true;
    }
    // eslint-disable-next-line eqeqeq
    return toComparable(key1, true) == toComparable(key2, true);
};

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const base64_encode = function(input) {
    if(!Array.isArray(input)) {
        input = stringToByteArray(String(input));
    }

    let result = '';

    function getBase64Char(index) {
        return BASE64_CHARS.charAt(index);
    }

    for(let i = 0; i < input.length; i += 3) {

        const octet1 = input[i];
        const octet2 = input[i + 1];
        const octet3 = input[i + 2];

        result += map(
            [
                octet1 >> 2,
                ((octet1 & 3) << 4) | octet2 >> 4,
                isNaN(octet2) ? 64 : ((octet2 & 15) << 2) | octet3 >> 6,
                isNaN(octet3) ? 64 : octet3 & 63
            ],
            getBase64Char
        ).join('');
    }

    return result;
};

function stringToByteArray(str) {
    const bytes = [];
    let code;
    let i;

    for(i = 0; i < str.length; i++) {
        code = str.charCodeAt(i);

        if(code < 128) {
            bytes.push(code);
        } else if(code < 2048) {
            bytes.push(192 + (code >> 6), 128 + (code & 63));
        } else if(code < 65536) {
            bytes.push(224 + (code >> 12), 128 + ((code >> 6) & 63), 128 + (code & 63));
        } else if(code < 2097152) {
            bytes.push(240 + (code >> 18), 128 + ((code >> 12) & 63), 128 + ((code >> 6) & 63), 128 + (code & 63));
        }
    }
    return bytes;
}

const isUnaryOperation = function(crit) {
    return crit[0] === '!' && Array.isArray(crit[1]);
};

const isGroupOperator = function(value) {
    return value === 'and' || value === 'or';
};

const isGroupCriterion = function(crit) {
    const first = crit[0];
    const second = crit[1];

    if(Array.isArray(first)) {
        return true;
    }
    if(typeUtils.isFunction(first)) {
        if(Array.isArray(second) || typeUtils.isFunction(second) || isGroupOperator(second)) {
            return true;
        }
    }

    return false;
};

const trivialPromise = function() {
    const d = new Deferred();
    return d.resolve.apply(d, arguments).promise();
};

const rejectedPromise = function() {
    const d = new Deferred();
    return d.reject.apply(d, arguments).promise();
};

function throttle(func, timeout) {
    let timeoutId;
    let lastArgs;
    return function() {
        lastArgs = arguments;
        if(!timeoutId) {
            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                if(lastArgs) {
                    func.call(this, lastArgs);
                }
            }, isFunction(timeout) ? timeout() : timeout);
        }
        return timeoutId;
    };
}

function throttleChanges(func, timeout) {
    let cache = [];
    const throttled = throttle(function() {
        func.call(this, cache);
        cache = [];
    }, timeout);

    return function(changes) {
        if(Array.isArray(changes)) {
            cache.push(...changes);
        }
        return throttled.call(this, cache);
    };
}

/**
* @name Utils
*/
const utils = {
    XHR_ERROR_UNLOAD: XHR_ERROR_UNLOAD,

    normalizeBinaryCriterion: normalizeBinaryCriterion,
    normalizeSortingInfo: normalizeSortingInfo,
    errorMessageFromXhr: errorMessageFromXhr,
    aggregators: aggregators,

    keysEqual: keysEqual,
    throttleChanges: throttleChanges,
    trivialPromise: trivialPromise,
    rejectedPromise: rejectedPromise,

    isDisjunctiveOperator: isDisjunctiveOperator,
    isConjunctiveOperator: isConjunctiveOperator,

    processRequestResultLock: processRequestResultLock,

    isUnaryOperation: isUnaryOperation,
    isGroupCriterion: isGroupCriterion,

    /**
    * @name Utils.base64_encode
    * @publicName base64_encode(input)
    * @param1 input:string|Array<number>
    * @return string
    * @namespace DevExpress.data
    * @module data/utils
    * @export base64_encode
    */
    base64_encode: base64_encode
};

module.exports = utils;
