import { version } from '../../core/version';
import { format as _stringFormat } from '../../core/utils/string';
import warnings from './errors_warnings';
import { each } from '../../core/utils/iterator';
import _windowResizeCallbacks from '../../core/utils/resize_callbacks';
import resizeObserverSingleton from '../../core/resize_observer';
import { normalizeEnum } from './utils';

const ERROR_MESSAGES = warnings.ERROR_MESSAGES;

export function createEventTrigger(eventsMap, callbackGetter) {
    let triggers = {};

    each(eventsMap, function(name, info) {
        if(info.name) {
            createEvent(name);
        }
    });
    let changes;
    triggerEvent.change = function(name) {
        const eventInfo = eventsMap[name];
        if(eventInfo) {
            (changes = changes || {})[name] = eventInfo;
        }
        return !!eventInfo;
    };
    triggerEvent.applyChanges = function() {
        if(changes) {
            each(changes, function(name, eventInfo) {
                createEvent(eventInfo.newName || name);
            });
            changes = null;
        }
    };
    triggerEvent.dispose = function() {
        eventsMap = callbackGetter = triggers = null;
    };

    return triggerEvent;

    function createEvent(name) {
        const eventInfo = eventsMap[name];

        triggers[eventInfo.name] = callbackGetter(name, eventInfo.actionSettings);
    }

    function triggerEvent(name, arg, complete) {
        triggers[name](arg);
        complete && complete();
    }
}

export let createIncidentOccurred = function(widgetName, eventTrigger) {
    return function incidentOccurred(id, args) {
        eventTrigger('incidentOccurred', {
            target: {
                id: id,
                type: id[0] === 'E' ? 'error' : 'warning',
                args: args,
                text: _stringFormat.apply(null, [ERROR_MESSAGES[id]].concat(args || [])),
                widget: widgetName,
                version: version
            }
        });
    };
};

function getResizeManager(resizeCallback) {
    return (observe, unsubscribe) => {
        const { handler, dispose } = createDeferredHandler(resizeCallback, unsubscribe);

        observe(handler);
        return dispose;
    };
}

function createDeferredHandler(callback, unsubscribe) {
    let timeout;

    const handler = function() {
        clearTimeout(timeout);
        timeout = setTimeout(callback, 100);
    };

    return {
        handler,
        dispose() {
            clearTimeout(timeout);
            unsubscribe(handler);
        }
    };
}

export function createResizeHandler(contentElement, redrawOnResize, resize) {
    let disposeHandler;
    const resizeManager = getResizeManager(resize);

    if(normalizeEnum(redrawOnResize) === 'windowonly') {
        disposeHandler = resizeManager(
            (handler)=> _windowResizeCallbacks.add(handler),
            (handler) => _windowResizeCallbacks.remove(handler)
        );
    } else if(redrawOnResize === true) {
        disposeHandler = resizeManager(
            (handler) => resizeObserverSingleton.observe(contentElement, handler),
            () => resizeObserverSingleton.unobserve(contentElement)
        );
    }
    return disposeHandler;
}

///#DEBUG
export { createEventTrigger as DEBUG_createEventTrigger };

export const DEBUG_createIncidentOccurred = createIncidentOccurred;

export function DEBUG_stub_createIncidentOccurred(stub) {
    createIncidentOccurred = stub;
}

export function DEBUG_restore_createIncidentOccurred() {
    createIncidentOccurred = DEBUG_createIncidentOccurred;
}

export { createResizeHandler as DEBUG_createResizeHandler };
///#ENDDEBUG
