import { inArray } from "./array";
import domAdapter from "../dom_adapter";
import { ensureDefined } from "./common";
import callOnce from "./call_once";
import windowUtils from "./window";
import devices from "../devices";
import styleUtils from "./style";

const {
    maxTouchPoints,
    msMaxTouchPoints, // TODO: remove this line when we drop IE support
    pointerEnabled
} = windowUtils.getNavigator();
const hasProperty = windowUtils.hasProperty.bind(windowUtils);
const transitionEndEventNames = {
    'webkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MsTransitionEnd',
    'transition': 'transitionend'
};

const supportProp = function(prop) {
    return !!styleUtils.styleProp(prop);
};

const isNativeScrollingSupported = function() {
    const { platform, version, mac: isMac } = devices.real();
    const isObsoleteAndroid = (version && version[0] < 4 && platform === "android");
    const isNativeScrollDevice = !isObsoleteAndroid && inArray(platform, ["ios", "android", "win"]) > -1 || isMac;

    return isNativeScrollDevice;
};

const inputType = function(type) {
    if(type === "text") {
        return true;
    }

    const input = domAdapter.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value;
    } catch(e) {
        return false;
    }
};

const detectTouchEvents = function(hasWindowProperty, maxTouchPoints) {
    return (hasWindowProperty("ontouchstart") || !!maxTouchPoints) && !hasWindowProperty("callPhantom");
};

const detectPointerEvent = function(hasWindowProperty, pointerEnabled) {
    // TODO: remove the check of the 'pointerEnabled' when we drop IE support
    const isPointerEnabled = ensureDefined(pointerEnabled, true);
    const canUsePointerEvent = ensureDefined(pointerEnabled, false);

    return hasWindowProperty("PointerEvent") && isPointerEnabled || canUsePointerEvent;
};

const touchEvents = detectTouchEvents(hasProperty, maxTouchPoints);
const pointerEvents = detectPointerEvent(hasProperty, pointerEnabled);
const touchPointersPresent = !!maxTouchPoints || !!msMaxTouchPoints;

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
