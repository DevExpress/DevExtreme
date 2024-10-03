import devices from '../devices';
import domAdapter from '../dom_adapter';
import callOnce from './call_once';
import { styleProp, stylePropPrefix } from './style';
import { getNavigator, hasProperty } from './window';

const {
  maxTouchPoints,
} = getNavigator();
const transitionEndEventNames = {
  webkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  transition: 'transitionend',
};

const supportProp = function (prop) {
  return !!styleProp(prop);
};

const isNativeScrollingSupported = function () {
  const { platform, mac: isMac } = devices.real();
  const isNativeScrollDevice = platform === 'ios' || platform === 'android' || isMac;

  return isNativeScrollDevice;
};

const inputType = function (type) {
  if (type === 'text') {
    return true;
  }

  const input = domAdapter.createElement('input');
  try {
    input.setAttribute('type', type);
    input.value = 'wrongValue';
    return !input.value;
  } catch (e) {
    return false;
  }
};

const detectTouchEvents = function (hasWindowProperty, maxTouchPoints) {
  return (hasWindowProperty('ontouchstart') || !!maxTouchPoints) && !hasWindowProperty('callPhantom');
};

const detectPointerEvent = function (hasWindowProperty) {
  return hasWindowProperty('PointerEvent');
};

const touchEvents = detectTouchEvents(hasProperty, maxTouchPoints);
const pointerEvents = detectPointerEvent(hasProperty);
const touchPointersPresent = !!maxTouchPoints;

/// #DEBUG
export {
  detectPointerEvent,
  detectTouchEvents,
};
/// #ENDDEBUG
export {
  inputType,
  pointerEvents,
  styleProp,
  stylePropPrefix,
  supportProp,
  touchEvents,
};

export const touch = touchEvents || pointerEvents && touchPointersPresent;
export const transition = callOnce(() => supportProp('transition'));
export const transitionEndEventName = callOnce(() => transitionEndEventNames[styleProp('transition')]);
export const animation = callOnce(() => supportProp('animation'));
export const nativeScrolling = isNativeScrollingSupported();
