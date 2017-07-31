"use strict";

var $ = require("../core/renderer"),
    isFunction = require("../core/utils/type").isFunction,
    map = require("../core/utils/iterator").map,
    toComparable = require("../core/utils/data").toComparable;

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
        return {
            selector: (isFunction(i) || typeof i === "string") ? i : (i.getter || i.field || i.selector),
            desc: !!(i.desc || String(i.dir).charAt(0).toLowerCase() === "d")
        };
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


    return function(xhr, textStatus) {
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
            lockDeferred = $.Deferred();
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
        var deferred = lockCount === 0 ? $.Deferred().resolve() : lockDeferred;
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
    /* jshint eqeqeq:false */

    if(Array.isArray(keyExpr)) {
        var names = map(key1, function(v, k) { return k; }),
            name;
        for(var i = 0; i < names.length; i++) {
            name = names[i];
            if(toComparable(key1[name], true) != toComparable(key2[name], true)) {
                return false;
            }
        }
        return true;
    }
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

/**
* @name Utils
* @publicName Utils
*/
var utils = {
    normalizeBinaryCriterion: normalizeBinaryCriterion,
    normalizeSortingInfo: normalizeSortingInfo,
    errorMessageFromXhr: errorMessageFromXhr,
    aggregators: aggregators,

    keysEqual: keysEqual,

    isDisjunctiveOperator: isDisjunctiveOperator,
    isConjunctiveOperator: isConjunctiveOperator,

    processRequestResultLock: processRequestResultLock,

    isUnaryOperation: isUnaryOperation,

    /**
    * @name Utils_base64encode
    * @publicName base64_encode(input)
    * @param1 input:string|array
    * @return string
    * @module data/utils
    * @export base64_encode
    */
    base64_encode: base64_encode
};

module.exports = utils;
