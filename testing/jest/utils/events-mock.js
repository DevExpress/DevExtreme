import eventsEngine from '../../../js/events/core/events_engine';
import { keyboard } from '../../../js/events/short';

let eventHandlers = {};
let keyboardHandlers = {};

export const KEY = {
    enter: 'enter',
    space: 'space'
};

export const clear = () => {
    eventHandlers = {};
    keyboardHandlers = {};
};

export const EVENT = {
    active: 'dxactive',
    blur: 'focusout',
    click: 'click',
    dxClick: 'dxclick',
    focus: 'focusin',
    hoverEnd: 'dxhoverend',
    hoverStart: 'dxhoverstart',
    inactive: 'dxinactive'
};

export const defaultEvent = {
    stopImmediatePropagation: () => void 0,
    preventDefault: () => void 0,
    isDefaultPrevented: () => void 0,
    stopPropagation: () => void 0,
};

export const fakeClickEvent = Object.assign(defaultEvent, {
    screenX: 0,
    offsetX: 0,
    pageX: 0
});

export const emitKeyboard = (key, e = defaultEvent) => {
    for(const id in keyboardHandlers) {
        keyboardHandlers[id].forEach(
            handler => handler({ originalEvent: e, keyName: key })
        );
    }
};

export const emit = (event, e = defaultEvent, element) => {
    eventHandlers[event]?.forEach(({ handler, el }) => {
        if(!element || el === element) {
            handler(e);
        }
    });
};

let keyboardSubscriberId = 0;

keyboard.on = (el, focusTarget, handler) => {
    keyboardSubscriberId++;
    keyboardHandlers[keyboardSubscriberId] = keyboardHandlers[keyboardSubscriberId] || [];
    keyboardHandlers[keyboardSubscriberId].push(handler);

    return keyboardSubscriberId;
};

eventsEngine.on = (...args) => {
    const event = args[1].split('.')[0];

    if(!eventHandlers[event]) {
        eventHandlers[event] = [];
    }

    eventHandlers[event].push({
        handler: args[args.length - 1],
        el: args[0]
    });
};

eventsEngine.off = (el, event) => eventHandlers[event] = [];
keyboard.off = id => delete keyboardHandlers[id];
