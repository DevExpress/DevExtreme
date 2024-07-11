"use strict";

exports.stopEventsSkipping = exports.setEventFixMethod = exports.normalizeKeyName = exports.needSkipEvent = exports.isTouchEvent = exports.isPointerEvent = exports.isMouseEvent = exports.isKeyboardEvent = exports.isFakeClickEvent = exports.isDxMouseWheelEvent = exports.isCommandKeyPressed = exports.hasTouches = exports.getChar = exports.forceSkipEvents = exports.fireEvent = exports.eventSource = exports.eventDelta = exports.eventData = exports.createEvent = exports.addNamespace = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _add_namespace = _interopRequireDefault(require("./add_namespace"));
var _events_engine = _interopRequireDefault(require("../core/events_engine"));
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _selectors = require("../../ui/widget/selectors");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const KEY_MAP = {
  'backspace': 'backspace',
  'tab': 'tab',
  'enter': 'enter',
  'escape': 'escape',
  'pageup': 'pageUp',
  'pagedown': 'pageDown',
  'end': 'end',
  'home': 'home',
  'arrowleft': 'leftArrow',
  'arrowup': 'upArrow',
  'arrowright': 'rightArrow',
  'arrowdown': 'downArrow',
  'delete': 'del',
  ' ': 'space',
  'f': 'F',
  'a': 'A',
  '*': 'asterisk',
  '-': 'minus',
  'alt': 'alt',
  'control': 'control',
  'shift': 'shift'
};
const LEGACY_KEY_CODES = {
  // iOS 10.2 and lower didn't supports KeyboardEvent.key
  '8': 'backspace',
  '9': 'tab',
  '13': 'enter',
  '27': 'escape',
  '33': 'pageUp',
  '34': 'pageDown',
  '35': 'end',
  '36': 'home',
  '37': 'leftArrow',
  '38': 'upArrow',
  '39': 'rightArrow',
  '40': 'downArrow',
  '46': 'del',
  '32': 'space',
  '70': 'F',
  '65': 'A',
  '106': 'asterisk',
  '109': 'minus',
  '189': 'minus',
  '173': 'minus',
  '16': 'shift',
  '17': 'control',
  '18': 'alt'
};
const EVENT_SOURCES_REGEX = {
  dx: /^dx/i,
  mouse: /(mouse|wheel)/i,
  touch: /^touch/i,
  keyboard: /^key/i,
  pointer: /^(ms)?pointer/i
};
let fixMethod = e => e;
const copyEvent = originalEvent => fixMethod(_events_engine.default.Event(originalEvent, originalEvent), originalEvent);
const isDxEvent = e => eventSource(e) === 'dx';
const isNativeMouseEvent = e => eventSource(e) === 'mouse';
const isNativeTouchEvent = e => eventSource(e) === 'touch';
const eventSource = _ref => {
  let {
    type
  } = _ref;
  let result = 'other';
  (0, _iterator.each)(EVENT_SOURCES_REGEX, function (key) {
    if (this.test(type)) {
      result = key;
      return false;
    }
  });
  return result;
};
exports.eventSource = eventSource;
const isPointerEvent = e => eventSource(e) === 'pointer';
exports.isPointerEvent = isPointerEvent;
const isMouseEvent = e => isNativeMouseEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'mouse';
exports.isMouseEvent = isMouseEvent;
const isDxMouseWheelEvent = e => e && e.type === 'dxmousewheel';
exports.isDxMouseWheelEvent = isDxMouseWheelEvent;
const isTouchEvent = e => isNativeTouchEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'touch';
exports.isTouchEvent = isTouchEvent;
const isKeyboardEvent = e => eventSource(e) === 'keyboard';
exports.isKeyboardEvent = isKeyboardEvent;
const isFakeClickEvent = _ref2 => {
  let {
    screenX,
    offsetX,
    pageX
  } = _ref2;
  return screenX === 0 && !offsetX && pageX === 0;
};
exports.isFakeClickEvent = isFakeClickEvent;
const eventData = _ref3 => {
  let {
    pageX,
    pageY,
    timeStamp
  } = _ref3;
  return {
    x: pageX,
    y: pageY,
    time: timeStamp
  };
};
exports.eventData = eventData;
const eventDelta = (from, to) => ({
  x: to.x - from.x,
  y: to.y - from.y,
  time: to.time - from.time || 1
});
exports.eventDelta = eventDelta;
const hasTouches = e => {
  const {
    originalEvent,
    pointers
  } = e;
  if (isNativeTouchEvent(e)) {
    return (originalEvent.touches || []).length;
  }
  if (isDxEvent(e)) {
    return (pointers || []).length;
  }
  return 0;
};

// TODO: for tests
exports.hasTouches = hasTouches;
let skipEvents = false;
const forceSkipEvents = () => skipEvents = true;
exports.forceSkipEvents = forceSkipEvents;
const stopEventsSkipping = () => skipEvents = false;
exports.stopEventsSkipping = stopEventsSkipping;
const needSkipEvent = e => {
  // TODO: for tests
  if (skipEvents) {
    return true;
  }

  // TODO: this checking used in swipeable first move handler. is it correct?
  const {
    target
  } = e;
  const $target = (0, _renderer.default)(target);
  const isContentEditable = (target === null || target === void 0 ? void 0 : target.isContentEditable) || (target === null || target === void 0 ? void 0 : target.hasAttribute('contenteditable'));
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
    return touchInEditable && (0, _selectors.focused)($target);
  }
};
exports.needSkipEvent = needSkipEvent;
const setEventFixMethod = func => fixMethod = func;
exports.setEventFixMethod = setEventFixMethod;
const createEvent = (originalEvent, args) => {
  const event = copyEvent(originalEvent);
  args && (0, _extend.extend)(event, args);
  return event;
};
exports.createEvent = createEvent;
const fireEvent = props => {
  const {
    originalEvent,
    delegateTarget
  } = props;
  const event = createEvent(originalEvent, props);
  _events_engine.default.trigger(delegateTarget || event.target, event);
  return event;
};
exports.fireEvent = fireEvent;
const normalizeKeyName = _ref4 => {
  let {
    key,
    which
  } = _ref4;
  const normalizedKey = KEY_MAP[key === null || key === void 0 ? void 0 : key.toLowerCase()] || key;
  const normalizedKeyFromWhich = LEGACY_KEY_CODES[which];
  if (normalizedKeyFromWhich && normalizedKey === key) {
    return normalizedKeyFromWhich;
  } else if (!normalizedKey && which) {
    return String.fromCharCode(which);
  }
  return normalizedKey;
};
exports.normalizeKeyName = normalizeKeyName;
const getChar = _ref5 => {
  let {
    key,
    which
  } = _ref5;
  return key || String.fromCharCode(which);
};
exports.getChar = getChar;
const addNamespace = exports.addNamespace = _add_namespace.default;
const isCommandKeyPressed = _ref6 => {
  let {
    ctrlKey,
    metaKey
  } = _ref6;
  return ctrlKey || metaKey;
};
exports.isCommandKeyPressed = isCommandKeyPressed;