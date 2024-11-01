import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { focused } from '@js/ui/widget/selectors';

import mappedAddNamespace from './m_add_namespace';
/* eslint-disable spellcheck/spell-checker */
const KEY_MAP = {
  backspace: 'backspace',
  tab: 'tab',
  enter: 'enter',
  escape: 'escape',
  pageup: 'pageUp',
  pagedown: 'pageDown',
  end: 'end',
  home: 'home',
  arrowleft: 'leftArrow',
  arrowup: 'upArrow',
  arrowright: 'rightArrow',
  arrowdown: 'downArrow',
  delete: 'del',
  ' ': 'space',
  f: 'F',
  a: 'A',
  '*': 'asterisk',
  '-': 'minus',
  alt: 'alt',
  control: 'control',
  shift: 'shift',
};

const LEGACY_KEY_CODES = {
  // iOS 10.2 and lower didn't supports KeyboardEvent.key
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  27: 'escape',
  33: 'pageUp',
  34: 'pageDown',
  35: 'end',
  36: 'home',
  37: 'leftArrow',
  38: 'upArrow',
  39: 'rightArrow',
  40: 'downArrow',
  46: 'del',
  32: 'space',
  70: 'F',
  65: 'A',
  106: 'asterisk',
  109: 'minus',
  189: 'minus',
  173: 'minus',
  16: 'shift',
  17: 'control',
  18: 'alt',
};

const EVENT_SOURCES_REGEX = {
  dx: /^dx/i,
  mouse: /(mouse|wheel)/i,
  touch: /^touch/i,
  keyboard: /^key/i,
  pointer: /^(ms)?pointer/i,
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export const eventSource = ({ type }) => {
  let result = 'other';
  /* eslint-disable @typescript-eslint/no-invalid-void-type */
  // eslint-disable-next-line consistent-return
  each(EVENT_SOURCES_REGEX, function (key): boolean | void {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    if (this.test(type)) {
      result = key;

      return false;
    }
  });

  return result;
};

let fixMethod = (e) => e;
// @ts-expect-error
const getEvent = (originalEvent) => eventsEngine.Event(originalEvent, originalEvent);
// @ts-expect-error
const copyEvent = (originalEvent) => fixMethod(getEvent(originalEvent), originalEvent);

const isDxEvent = (e) => eventSource(e) === 'dx';
const isNativeMouseEvent = (e) => eventSource(e) === 'mouse';
const isNativeTouchEvent = (e) => eventSource(e) === 'touch';

export const isPointerEvent = (e) => eventSource(e) === 'pointer';

export const isMouseEvent = (e) => isNativeMouseEvent(e)
  || ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'mouse');

export const isDxMouseWheelEvent = (e) => e && e.type === 'dxmousewheel';

export const isTouchEvent = (e) => isNativeTouchEvent(e)
  || ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'touch');

export const isKeyboardEvent = (e) => eventSource(e) === 'keyboard';

export const isFakeClickEvent = ({
  screenX,
  offsetX,
  pageX,
}) => screenX === 0 && !offsetX && pageX === 0;

export const eventData = ({ pageX, pageY, timeStamp }) => ({
  x: pageX,
  y: pageY,
  time: timeStamp,
});

export const eventDelta = (from, to) => ({
  x: to.x - from.x,
  y: to.y - from.y,
  time: to.time - from.time || 1,
});

export const hasTouches = (e) => {
  const { originalEvent, pointers } = e;

  if (isNativeTouchEvent(e)) {
    return (originalEvent.touches || []).length;
  }

  if (isDxEvent(e)) {
    return (pointers || []).length;
  }

  return 0;
};

// TODO: for tests
let skipEvents = false;
export const forceSkipEvents = () => { skipEvents = true; };
export const stopEventsSkipping = () => { skipEvents = false; };
// eslint-disable-next-line consistent-return
export const needSkipEvent = (e) => {
  // TODO: for tests
  if (skipEvents) {
    return true;
  }

  // TODO: this checking used in swipeable first move handler. is it correct?
  const { target } = e;
  const $target = $(target);
  const isContentEditable = target?.isContentEditable || target?.hasAttribute('contenteditable');
  const touchInEditable = $target.is('input, textarea, select') || isContentEditable;

  if (isDxMouseWheelEvent(e)) {
    const isTextArea = $target.is('textarea') && $target.hasClass('dx-texteditor-input');

    if (isTextArea || isContentEditable) {
      return false;
    }

    const isInputFocused = $target.is('input[type=\'number\'], textarea, select') && $target.is(':focus');

    return isInputFocused;
  }

  if (isMouseEvent(e)) {
    return touchInEditable || e.which > 1; // only left mouse button
  }

  if (isTouchEvent(e)) {
    return touchInEditable && focused($target);
  }
};

export const setEventFixMethod = (func) => { fixMethod = func; };

export const createEvent = (originalEvent, args) => {
  const event = copyEvent(originalEvent);

  if (args) {
    extend(event, args);
  }

  return event;
};

export const fireEvent = (props) => {
  const { originalEvent, delegateTarget } = props;
  const event = createEvent(originalEvent, props);
  // @ts-expect-error
  eventsEngine.trigger(delegateTarget || event.target, event);

  return event;
};

export const normalizeKeyName = ({ key, which }) => {
  const normalizedKey = KEY_MAP[key?.toLowerCase()] || key;
  const normalizedKeyFromWhich = LEGACY_KEY_CODES[which];
  if (normalizedKeyFromWhich && normalizedKey === key) {
    return normalizedKeyFromWhich;
  }

  if (!normalizedKey && which) {
    return String.fromCharCode(which);
  }

  return normalizedKey;
};

export const getChar = ({ key, which }) => key || String.fromCharCode(which);

export const addNamespace = mappedAddNamespace;

export const isCommandKeyPressed = ({ ctrlKey, metaKey }) => ctrlKey || metaKey;
