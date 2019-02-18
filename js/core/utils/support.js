var inArray = require("./array").inArray,
    domAdapter = require("../dom_adapter"),
    callOnce = require("./call_once"),
    windowUtils = require("./window"),
    navigator = windowUtils.getNavigator(),
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

    var input = domAdapter.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value;
    } catch(e) {
        return false;
    }
};

var detectTouchEvents = function(window, maxTouchPoints) {
    return (window.hasProperty("ontouchstart") || !!maxTouchPoints) && !window.hasProperty("callPhantom");
};

var detectPointerEvent = function(window, navigator) {
    return window.hasProperty("PointerEvent") || !!navigator.pointerEnabled;
};

var touchEvents = detectTouchEvents(windowUtils, navigator.maxTouchPoints);
var pointerEvents = detectPointerEvent(windowUtils, navigator);
var touchPointersPresent = !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints;

///#DEBUG
exports.detectTouchEvents = detectTouchEvents;
exports.detectPointerEvent = detectPointerEvent;
///#ENDDEBUG
exports.touchEvents = touchEvents;
exports.pointerEvents = pointerEvents;
exports.touch = touchEvents || pointerEvents && touchPointersPresent;
exports.transition = callOnce(function() { return supportProp("transition"); });
exports.transitionEndEventName = callOnce(function() { return transitionEndEventNames[styleUtils.styleProp("transition")]; });
exports.animation = callOnce(function() { return supportProp("animation"); });
exports.nativeScrolling = isNativeScrollingSupported();

exports.styleProp = styleUtils.styleProp;
exports.stylePropPrefix = styleUtils.stylePropPrefix;
exports.supportProp = supportProp;

exports.inputType = inputType;
