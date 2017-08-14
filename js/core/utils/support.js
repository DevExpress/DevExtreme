"use strict";

var inArray = require("./array").inArray,
    devices = require("../devices"),
    styleUtils = require("./style");

var transitionEndEventNames = {
    'webkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MsTransitionEnd',
    'transition': 'transitionend'
};

var supportProp = function(prop) {
    return !!styleUtils.styleProp(prop);
};

var isNativeScrollingSupported = function() {
    var realDevice = devices.real(),
        realPlatform = realDevice.platform,
        realVersion = realDevice.version,
        isObsoleteAndroid = (realVersion && realVersion[0] < 4 && realPlatform === "android"),
        isNativeScrollDevice = !isObsoleteAndroid && inArray(realPlatform, ["ios", "android", "win"]) > -1 || realDevice.mac;

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
exports.transition = supportProp("transition");
exports.transitionEndEventName = transitionEndEventNames[styleUtils.styleProp("transition")];
exports.animation = supportProp("animation");
exports.nativeScrolling = isNativeScrollingSupported();

exports.styleProp = styleUtils.styleProp;
exports.stylePropPrefix = styleUtils.stylePropPrefix;
exports.supportProp = supportProp;

exports.hasKo = !!window.ko;
exports.inputType = inputType;
