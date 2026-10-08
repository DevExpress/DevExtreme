import devices from '@js/common/core/environment/devices';
import domAdapter from '@js/core/dom_adapter';
import { styleProp, stylePropPrefix } from '@js/core/utils/style';
import { getNavigator, hasProperty } from '@js/core/utils/window';
import { callOnce } from '@ts/core/utils/call_once';

const {
  maxTouchPoints,
} = getNavigator();
const transitionEndEventNames: Record<string, string> = {
  webkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  transition: 'transitionend',
};

const supportProp = function supportProp(prop: string): boolean {
  return !!styleProp(prop);
};

const isNativeScrollingSupported = function isNativeScrollingSupported(): boolean {
  const { platform, mac: isMac } = devices.real();
  const isNativeScrollDevice = platform === 'ios' || platform === 'android' || isMac;

  return isNativeScrollDevice;
};

const inputType = function inputType(type?: string): boolean {
  if (type === 'text') {
    return true;
  }

  const input = domAdapter.createElement('input');
  try {
    input.setAttribute('type', type as string);
    // @ts-expect-error need smarter typing
    input.value = 'wrongValue';
    // @ts-expect-error need smarter typing
    return !input.value;
  } catch (e) {
    return false;
  }
};

const detectTouchEvents = function detectTouchEvents(
  hasWindowProperty: (property: string) => boolean,
  touchPointsCount?: number,
): boolean {
  return (hasWindowProperty('ontouchstart') || !!touchPointsCount)
    && !hasWindowProperty('callPhantom');
};

const detectPointerEvent = function detectPointerEvent(
  hasWindowProperty: (property: string) => boolean,
): boolean {
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

export const touch = touchEvents || (pointerEvents && touchPointersPresent);
export const transition = callOnce(() => supportProp('transition'));
export const transitionEndEventName = callOnce(
  () => transitionEndEventNames[styleProp('transition')],
);
export const animation = callOnce(() => supportProp('animation'));
export const nativeScrolling = isNativeScrollingSupported();

export default {
  animation,
  inputType,
  nativeScrolling,
  pointerEvents,
  styleProp,
  stylePropPrefix,
  supportProp,
  touch,
  touchEvents,
  transition,
  transitionEndEventName,
};
