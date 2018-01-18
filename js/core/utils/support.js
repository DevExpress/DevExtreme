"use strict";

var inArray = require("./array").inArray,
    window = require("../../core/dom_adapter").getWindow(),
    navigator = require("../../core/utils/navigator"),
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

    var input = window.document.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value;
    } catch(e) {
        return false;
    }
};

var touchEvents = "ontouchstart" in window && !('callPhantom' in window),
    pointerEvents = !!navigator.pointerEnabled || !!navigator.msPointerEnabled,
    touchPointersPresent = !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints;

exports.touchEvents = touchEvents;
exports.pointerEvents = pointerEvents;
exports.touch = touchEvents || pointerEvents && touchPointersPresent;
exports.transition = function() { return supportProp("transition"); };
exports.transitionEndEventName = function() { return transitionEndEventNames[styleUtils.styleProp("transition")]; };
exports.animation = function() { return supportProp("animation"); };
exports.nativeScrolling = isNativeScrollingSupported();

exports.styleProp = styleUtils.styleProp;
exports.stylePropPrefix = styleUtils.stylePropPrefix;
exports.supportProp = supportProp;

exports.inputType = inputType;
