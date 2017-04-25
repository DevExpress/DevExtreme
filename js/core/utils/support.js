"use strict";

var $ = require("jquery"),
    inflector = require("./inflector"),
    devices = require("../devices");

var camelize = inflector.camelize;

var jsPrefixes = ["", "Webkit", "Moz", "O", "Ms"],
    cssPrefixes = {
        "": "",
        "Webkit": "-webkit-",
        "Moz": "-moz-",
        "O": "-o-",
        "ms": "-ms-"
    },
    styles = document.createElement("dx").style;

var transitionEndEventNames = {
    'webkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MsTransitionEnd',
    'transition': 'transitionend'
};

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

var supportProp = function(prop) {
    return !!styleProp(prop);
};

var isNativeScrollingSupported = function() {
    var realDevice = devices.real(),
        realPlatform = realDevice.platform,
        realVersion = realDevice.version,
        isObsoleteAndroid = (realVersion && realVersion[0] < 4 && realPlatform === "android"),
        isNativeScrollDevice = !isObsoleteAndroid && $.inArray(realPlatform, ["ios", "android", "win"]) > -1 || realDevice.mac;

    return isNativeScrollDevice;
};

var inputType = function(type) {
    if(type === "text") {
        return true;
    }

    var input = document.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value;
    } catch(e) {
        return false;
    }
};

var touchEvents = "ontouchstart" in window && !('callPhantom' in window),
    pointerEvents = !!window.navigator.pointerEnabled || !!window.navigator.msPointerEnabled,
    touchPointersPresent = !!window.navigator.maxTouchPoints || !!window.navigator.msMaxTouchPoints;

exports.touchEvents = touchEvents;
exports.pointerEvents = pointerEvents;
exports.touch = touchEvents || pointerEvents && touchPointersPresent;
exports.transform = supportProp("transform");
exports.transition = supportProp("transition");
exports.transitionEndEventName = transitionEndEventNames[styleProp("transition")];
exports.animation = supportProp("animation");
exports.nativeScrolling = isNativeScrollingSupported();

exports.styleProp = styleProp;
exports.stylePropPrefix = stylePropPrefix;
exports.supportProp = supportProp;

exports.hasKo = !!window.ko;
exports.inputType = inputType;
