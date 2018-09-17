import { isFunction, isPlainObject, isEmptyObject } from "../core/utils/type";
import Guid from "../core/guid";
import domAdapter from "../core/dom_adapter";
import { add as ready } from "../core/utils/ready_callbacks";
import { extend } from "../core/utils/extend";
import windowUtils from "../core/utils/window";
import { map } from "../core/utils/iterator";
import { errors } from "./errors";
import objectUtils from "../core/utils/object";
import { toComparable } from "../core/utils/data";
import { Deferred } from "../core/utils/deferred";

var window = windowUtils.getWindow();

var XHR_ERROR_UNLOAD = "DEVEXTREME_XHR_ERROR_UNLOAD";

var normalizeBinaryCriterion = function(crit) {
    return [
        crit[0],
        crit.length < 3 ? "=" : String(crit[1]).toLowerCase(),
        crit.length < 2 ? true : crit[crit.length - 1]
    ];
};

var normalizeSortingInfo = function(info) {
    if(!Array.isArray(info)) {
        info = [info];
    }

    return map(info, function(i) {
        var result = {
            selector: (isFunction(i) || typeof i === "string") ? i : (i.getter || i.field || i.selector),
            desc: !!(i.desc || String(i.dir).charAt(0).toLowerCase() === "d")
        };
        if(i.compare) {
            result.compare = i.compare;
        }
        return result;
    });
};

var errorMessageFromXhr = (function() {
    var textStatusMessages = {
        "timeout": "Network connection timeout",
        "error": "Unspecified network error",
        "parsererror": "Unexpected server response"
    };

    ///#DEBUG
    var textStatusDetails = {
        "timeout": "possible causes: the remote host is not accessible, overloaded or is not included into the domain white-list when being run in the native container",
        "error": "if the remote host is located on another domain, make sure it properly supports cross-origin resource sharing (CORS), or use the JSONP approach instead",
        "parsererror": "the remote host did not respond with valid JSON data"
    };
    ///#ENDDEBUG

    var explainTextStatus = function(textStatus) {
        var result = textStatusMessages[textStatus];

        if(!result) {
            return textStatus;
        }

        ///#DEBUG
        result += " (" + textStatusDetails[textStatus] + ")";
        ///#ENDDEBUG

        return result;
    };

    // T542570, https://stackoverflow.com/a/18170879
    var unloading;
    ready(function() {
        domAdapter.listen(window, "beforeunload", function() { unloading = true; });
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

var aggregators = {
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

var processRequestResultLock = (function() {
    var lockCount = 0,
        lockDeferred;

    var obtain = function() {
        if(lockCount === 0) {
            lockDeferred = new Deferred();
        }
        lockCount++;
    };

    var release = function() {
        lockCount--;
        if(lockCount < 1) {
            lockDeferred.resolve();
        }
    };

    var promise = function() {
        var deferred = lockCount === 0 ? new Deferred().resolve() : lockDeferred;
        return deferred.promise();
    };

    var reset = function() {
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
    return /^(and|\&\&|\&)$/i.test(condition);
}

var keysEqual = function(keyExpr, key1, key2) {
    if(Array.isArray(keyExpr)) {
        var names = map(key1, function(v, k) { return k; }),
            name;
        for(var i = 0; i < names.length; i++) {
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

var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

var base64_encode = function(input) {
    if(!Array.isArray(input)) {
        input = stringToByteArray(String(input));
    }

    var result = "";

    function getBase64Char(index) {
        return BASE64_CHARS.charAt(index);
    }

    for(var i = 0; i < input.length; i += 3) {

        var octet1 = input[i],
            octet2 = input[i + 1],
            octet3 = input[i + 2];

        result += map(
            [
                octet1 >> 2,
                ((octet1 & 3) << 4) | octet2 >> 4,
                isNaN(octet2) ? 64 : ((octet2 & 15) << 2) | octet3 >> 6,
                isNaN(octet3) ? 64 : octet3 & 63
            ],
            getBase64Char
        ).join("");
    }

    return result;
};

var stringToByteArray = function(str) {
    var bytes = [],
        code, i;

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
};

var isUnaryOperation = function(crit) {
    return crit[0] === "!" && Array.isArray(crit[1]);
};

var trivialPromise = function() {
    var d = new Deferred();
    return d.resolve.apply(d, arguments).promise();
};

var rejectedPromise = function() {
    var d = new Deferred();
    return d.reject.apply(d, arguments).promise();
};

function ArrayHelper() {
    var hasKey = function(target, keyOrKeys) {
        var key,
            keys = typeof keyOrKeys === "string" ? keyOrKeys.split() : keyOrKeys.slice();

        while(keys.length) {
            key = keys.shift();
            if(key in target) {
                return true;
            }
        }

        return false;
    };

    this.push = function(array, batchData, keyInfo) {
        batchData.forEach(item => {
            switch(item.type) {
                case "update": this.updateArrayItem(array, item.key, item.data, keyInfo); break;
                case "insert": this.insertItemToArray(array, item.data, keyInfo); break;
                case "remove": this.removeItemFromArray(array, item.key, keyInfo); break;
            }
        });
    };

    this.updateArrayItem = function(array, key, data, keyInfo) {
        var target,
            extendComplexObject = true,
            keyExpr = keyInfo.key();

        if(keyExpr) {
            if(hasKey(data, keyExpr) && !keysEqual(keyExpr, key, keyInfo.keyOf(data))) {
                return rejectedPromise(errors.Error("E4017"));
            }

            let index = this.indexByKey(array, key, keyInfo);
            if(index < 0) {
                return rejectedPromise(errors.Error("E4009"));
            }

            target = array[index];
        } else {
            target = key;
        }

        objectUtils.deepExtendArraySafe(target, data, extendComplexObject);
        return trivialPromise(key, data);
    };

    this.insertItemToArray = function(array, data, keyInfo) {
        var keyValue,
            obj,
            keyExpr = keyInfo.key();

        obj = isPlainObject(data) ? extend({}, data) : data;

        if(keyExpr) {
            keyValue = keyInfo.keyOf(obj);
            if(keyValue === undefined || typeof keyValue === "object" && isEmptyObject(keyValue)) {
                if(Array.isArray(keyExpr)) {
                    throw errors.Error("E4007");
                }
                keyValue = obj[keyExpr] = String(new Guid());
            } else {
                if(array[this.indexByKey(array, keyValue, keyInfo)] !== undefined) {
                    return rejectedPromise(errors.Error("E4008"));
                }
            }
        } else {
            keyValue = obj;
        }

        array.push(obj);
        return trivialPromise(data, keyValue);
    };

    this.removeItemFromArray = function(array, key, keyInfo) {
        var index = this.indexByKey(array, key, keyInfo);
        if(index > -1) {
            array.splice(index, 1);
        }
        return trivialPromise(key);
    };

    this.indexByKey = function(array, key, keyInfo) {
        var keyExpr = keyInfo.key();
        for(var i = 0, arrayLength = array.length; i < arrayLength; i++) {
            if(keysEqual(keyExpr, keyInfo.keyOf(array[i]), key)) {
                return i;
            }
        }
        return -1;
    };
}

function createThrottle(func, timeout) {
    var timeoutId,
        lastArgs;
    return function() {
        lastArgs = arguments;
        if(!timeoutId) {
            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                if(lastArgs) {
                    func.call(this, lastArgs);
                }
            }, timeout);
        }
        return timeoutId;
    };
};

function createThrottleWithAggregation(func, timeout) {
    var cache = [],
        throttle = createThrottle(function() {
            func.call(this, cache);
            cache = [];
        }, timeout);

    return function(changes) {
        if(Array.isArray(changes)) {
            cache.push(...changes);
        }
        return throttle.call(this, cache);
    };
}

/**
* @name Utils
*/
var utils = {
    XHR_ERROR_UNLOAD: XHR_ERROR_UNLOAD,

    normalizeBinaryCriterion: normalizeBinaryCriterion,
    normalizeSortingInfo: normalizeSortingInfo,
    errorMessageFromXhr: errorMessageFromXhr,
    aggregators: aggregators,

    keysEqual: keysEqual,
    arrayHelper: new ArrayHelper(),
    createThrottleWithAggregation: createThrottleWithAggregation,
    trivialPromise: trivialPromise,
    rejectedPromise: rejectedPromise,

    isDisjunctiveOperator: isDisjunctiveOperator,
    isConjunctiveOperator: isConjunctiveOperator,

    processRequestResultLock: processRequestResultLock,

    isUnaryOperation: isUnaryOperation,

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
