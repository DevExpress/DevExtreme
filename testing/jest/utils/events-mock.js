import eventsEngine from '../../../js/events/core/events_engine';

const eventHandlers = {};

export const EVENT = {
    active: 'dxactive.UIFeedback',
    blur: 'focusout.UIFeedback',
    click: 'dxclick.UIFeedback',
    focus: 'focusin.UIFeedback',
    hoverEnd: 'dxhoverend.UIFeedback',
    hoverStart: 'dxhoverstart.UIFeedback',
    inactive: 'dxinactive.UIFeedback'
};

export const emit = (event, e = {}, element) => {
    eventHandlers[event]?.forEach(({ handler, el }) => {
        if(!element || el === element) {
            handler(e);
        }
    });
};

eventsEngine.on = (...args) => {
    if(!eventHandlers[args[1]]) {
        eventHandlers[args[1]] = [];
    }

    eventHandlers[args[1]].push({
        handler: args[args.length - 1],
        el: args[0]
    });
};

eventsEngine.off = (el, event) => {
    eventHandlers[event] = [];
};
