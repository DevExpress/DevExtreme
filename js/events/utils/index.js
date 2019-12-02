import $ from "../../core/renderer";
import addNamespace from "./add_namespace";
import eventsEngine from "../core/events_engine";
import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import { focused } from "../../ui/widget/selectors";

const KEY_MAP = {
    "backspace": "backspace",
    "tab": "tab",
    "enter": "enter",
    "escape": "escape",
    "pageup": "pageUp",
    "pagedown": "pageDown",
    "end": "end",
    "home": "home",
    "arrowleft": "leftArrow",
    "arrowup": "upArrow",
    "arrowright": "rightArrow",
    "arrowdown": "downArrow",
    "delete": "del",
    " ": "space",
    "f": "F",
    "a": "A",
    "*": "asterisk",
    "-": "minus",
    "alt": "alt",
    "control": "control",
    "shift": "shift",
    // IE11:
    "left": "leftArrow",
    "up": "upArrow",
    "right": "rightArrow",
    "down": "downArrow",
    "multiply": "asterisk",
    "spacebar": "space",
    "del": "del",
    "subtract": "minus",
    "esc": "escape"
};

const LEGACY_KEY_CODES = {
    // iOS 10.2 and lower didn't supports KeyboardEvent.key
    "8": "backspace",
    "9": "tab",
    "13": "enter",
    "27": "escape",
    "33": "pageUp",
    "34": "pageDown",
    "35": "end",
    "36": "home",
    "37": "leftArrow",
    "38": "upArrow",
    "39": "rightArrow",
    "40": "downArrow",
    "46": "del",
    "32": "space",
    "70": "F",
    "65": "A",
    "106": "asterisk",
    "109": "minus",
    "189": "minus",
    "173": "minus",
    "16": "shift",
    "17": "control",
    "18": "alt"
};

const eventSource = (() => {
    const EVENT_SOURCES_REGEX = {
        "dx": /^dx/i,
        "mouse": /(mouse|wheel)/i,
        "touch": /^touch/i,
        "keyboard": /^key/i,
        "pointer": /^(ms)?pointer/i
    };

    return (e) => {
        let result = "other";

        each(EVENT_SOURCES_REGEX, function(key) {
            if(this.test(e.type)) {
                result = key;
                return false;
            }
        });

        return result;
    };
})();


const isDxEvent = (e) => {
    return eventSource(e) === "dx";
};

const isNativeMouseEvent = (e) => {
    return eventSource(e) === "mouse";
};

const isNativeTouchEvent = (e) => {
    return eventSource(e) === "touch";
};

const isPointerEvent = (e) => {
    return eventSource(e) === "pointer";
};

const isMouseEvent = (e) => {
    return isNativeMouseEvent(e) || ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === "mouse");
};

const isDxMouseWheelEvent = (e) => {
    return e && e.type === "dxmousewheel";
};

const isTouchEvent = (e) => {
    return isNativeTouchEvent(e) || ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === "touch");
};

const isKeyboardEvent = (e) => {
    return eventSource(e) === "keyboard";
};

const isFakeClickEvent = (e) => {
    return e.screenX === 0 && !e.offsetX && e.pageX === 0;
};


const eventData = (e) => {
    return {
        x: e.pageX,
        y: e.pageY,
        time: e.timeStamp
    };
};

const eventDelta = function(from, to) {
    return {
        x: to.x - from.x,
        y: to.y - from.y,
        time: to.time - from.time || 1
    };
};


const hasTouches = (e) => {
    if(isNativeTouchEvent(e)) {
        return (e.originalEvent.touches || []).length;
    }
    if(isDxEvent(e)) {
        return (e.pointers || []).length;
    }
    return 0;
};

const needSkipEvent = (e) => {
    // TODO: this checking used in swipeable first move handler. is it correct?
    const target = e.target;
    const $target = $(target);
    const touchInInput = $target.is("input, textarea, select");

    if($target.is(".dx-skip-gesture-event *, .dx-skip-gesture-event")) {
        return true;
    }
    if(isDxMouseWheelEvent(e)) {
        const isTextArea = $target.is("textarea") && $target.hasClass("dx-texteditor-input");

        if(isTextArea) {
            return false;
        }

        const isContentEditable = target.isContentEditable || target.hasAttribute("contenteditable");
        if(isContentEditable) {
            return false;
        }

        const isInputFocused = $target.is("input[type='number'], textarea, select") && $target.is(':focus');
        return isInputFocused;
    }
    if(isMouseEvent(e)) {
        return touchInInput || e.which > 1; // only left mouse button
    }
    if(isTouchEvent(e)) {
        return touchInInput && focused($target);
    }
};


let fixMethod = (e) => { return e; };
const setEventFixMethod = function(func) {
    fixMethod = func;
};
const copyEvent = function(originalEvent) {
    return fixMethod(eventsEngine.Event(originalEvent, originalEvent), originalEvent);
};

const createEvent = function(originalEvent, args) {
    let event = copyEvent(originalEvent);

    if(args) {
        extend(event, args);
    }

    return event;
};

const fireEvent = function(props) {
    const event = createEvent(props.originalEvent, props);
    eventsEngine.trigger(props.delegateTarget || event.target, event);
    return event;
};

const normalizeKeyName = (event) => {
    const isKeySupported = !!event.key;
    let key = isKeySupported ? event.key : event.which;

    if(!key) {
        return;
    }

    if(isKeySupported) {
        key = KEY_MAP[key.toLowerCase()] || key;
    } else {
        key = LEGACY_KEY_CODES[key] || String.fromCharCode(key);
    }

    return key;
};

const getChar = (event) => {
    return event.key || String.fromCharCode(event.which);
};


module.exports = {
    eventSource: eventSource,
    isPointerEvent: isPointerEvent,
    isMouseEvent: isMouseEvent,
    isDxMouseWheelEvent: isDxMouseWheelEvent,
    isTouchEvent: isTouchEvent,
    isKeyboardEvent: isKeyboardEvent,

    isFakeClickEvent: isFakeClickEvent,

    hasTouches: hasTouches,
    eventData: eventData,
    eventDelta: eventDelta,
    needSkipEvent: needSkipEvent,

    createEvent: createEvent,
    fireEvent: fireEvent,

    addNamespace: addNamespace,
    setEventFixMethod: setEventFixMethod,

    normalizeKeyName: normalizeKeyName,
    getChar: getChar
};
