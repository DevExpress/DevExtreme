import eventsEngine from '../../../js/events/core/events_engine';

const eventHandlers = {};

export const EVENT = {
    active: 'dxactive',
    blur: 'focusout',
    click: 'dxclick',
    focus: 'focusin',
    hoverEnd: 'dxhoverend',
    hoverStart: 'dxhoverstart',
    inactive: 'dxinactive'
};

export const fakeClickEvent = {
    screenX: 0,
    offsetX: 0,
    pageX: 0,
    stopImmediatePropagation: () => void 0
};

export const emit = (event, e = {}, element) => {
    eventHandlers[event]?.forEach(({ handler, el }) => {
        if(!element || el === element) {
            handler(e);
        }
    });
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

eventsEngine.off = (el, event) => {
    eventHandlers[event] = [];
};
