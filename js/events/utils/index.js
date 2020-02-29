import $ from '../../core/renderer';
import mappedAddNamespace from './add_namespace';
import eventsEngine, { Event } from '../core/events_engine';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { focused } from '../../ui/widget/selectors';

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
    'shift': 'shift',
    // IE11:
    'left': 'leftArrow',
    'up': 'upArrow',
    'right': 'rightArrow',
    'down': 'downArrow',
    'multiply': 'asterisk',
    'spacebar': 'space',
    'del': 'del',
    'subtract': 'minus',
    'esc': 'escape'
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
const copyEvent = originalEvent => fixMethod(Event(originalEvent, originalEvent), originalEvent);
const isDxEvent = e => eventSource(e) === 'dx';
const isNativeMouseEvent = e => eventSource(e) === 'mouse';
const isNativeTouchEvent = e => eventSource(e) === 'touch';

export const eventSource = ({ type }) => {
    let result = 'other';

    each(EVENT_SOURCES_REGEX, function(key) {
        if(this.test(type)) {
            result = key;

            return false;
        }
    });

    return result;
};

export const isPointerEvent = e => eventSource(e) === 'pointer';

export const isMouseEvent = e => isNativeMouseEvent(e) ||
    ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'mouse');

export const isDxMouseWheelEvent = e => e && e.type === 'dxmousewheel';

export const isTouchEvent = e => isNativeTouchEvent(e) ||
    ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'touch');

export const isKeyboardEvent = e => eventSource(e) === 'keyboard';

export const isFakeClickEvent = ({ screenX, offsetX, pageX }) => screenX === 0 && !offsetX && pageX === 0;

export const eventData = ({ pageX, pageY, timeStamp }) => ({
    x: pageX,
    y: pageY,
    time: timeStamp
});

export const eventDelta = (from, to) => ({
    x: to.x - from.x,
    y: to.y - from.y,
    time: to.time - from.time || 1
});

export const hasTouches = e => {
    const { originalEvent, pointers } = e;

    if(isNativeTouchEvent(e)) {
        return (originalEvent.touches || []).length;
    }

    if(isDxEvent(e)) {
        return (pointers || []).length;
    }

    return 0;
};

// TODO: for tests
let skipEvents = false;
export const forceSkipEvents = () => skipEvents = true;
export const stopEventsSkipping = () => skipEvents = false;

export const needSkipEvent = e => {
    // TODO: for tests
    if(skipEvents) {
        return true;
    }

    // TODO: this checking used in swipeable first move handler. is it correct?
    const { target } = e;
    const $target = $(target);
    const touchInInput = $target.is('input, textarea, select');

    if($target.is('.dx-skip-gesture-event *, .dx-skip-gesture-event')) {
        return true;
    }

    if(isDxMouseWheelEvent(e)) {
        const isTextArea = $target.is('textarea') && $target.hasClass('dx-texteditor-input');

        if(isTextArea) {
            return false;
        }

        const isContentEditable = target.isContentEditable || target.hasAttribute('contenteditable');

        if(isContentEditable) {
            return false;
        }

        const isInputFocused = $target.is('input[type=\'number\'], textarea, select') && $target.is(':focus');

        return isInputFocused;
    }

    if(isMouseEvent(e)) {
        return touchInInput || e.which > 1; // only left mouse button
    }

    if(isTouchEvent(e)) {
        return touchInInput && focused($target);
    }
};

export const setEventFixMethod = func => fixMethod = func;

export const createEvent = (originalEvent, args) => {
    const event = copyEvent(originalEvent);

    args && extend(event, args);

    return event;
};

export const fireEvent = props => {
    const { originalEvent, delegateTarget } = props;
    const event = createEvent(originalEvent, props);

    eventsEngine.trigger(delegateTarget || event.target, event);

    return event;
};

export const normalizeKeyName = ({ key, which }) => {
    const isKeySupported = !!key;

    key = isKeySupported ? key : which;

    if(key) {
        if(isKeySupported) {
            key = KEY_MAP[key.toLowerCase()] || key;
        } else {
            key = LEGACY_KEY_CODES[key] || String.fromCharCode(key);
        }

        return key;
    }
};

export const getChar = ({ key, which }) => key || String.fromCharCode(which);

export const addNamespace = mappedAddNamespace;
