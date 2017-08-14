"use strict";

var camelize = require("./inflector").camelize;

var jsPrefixes = ["", "Webkit", "Moz", "O", "Ms"],
    cssPrefixes = {
        "": "",
        "Webkit": "-webkit-",
        "Moz": "-moz-",
        "O": "-o-",
        "ms": "-ms-",
        "Ms": "-ms-"
    },
    styles = document.createElement("dx").style;

var forEachPrefixes = function(prop, callBack) {
    prop = camelize(prop, true);

    var result;

    for(var i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i++) {
        var jsPrefix = jsPrefixes[i];
        var prefixedProp = jsPrefix + prop;
        var lowerPrefixedProp = camelize(prefixedProp);

        result = callBack(lowerPrefixedProp, jsPrefix);

        if(result === undefined) {
            result = callBack(prefixedProp, jsPrefix);
        }

        if(result !== undefined) {
            break;
        }
    }

    return result;
};

var styleProp = function(prop) {
    return forEachPrefixes(prop, function(specific) {
        if(specific in styles) {
            return specific;
        }
    });
};

var stylePropPrefix = function(prop) {
    return forEachPrefixes(prop, function(specific, jsPrefix) {
        if(specific in styles) {
            return cssPrefixes[jsPrefix];
        }
    });
};

exports.styleProp = styleProp;
exports.stylePropPrefix = stylePropPrefix;
