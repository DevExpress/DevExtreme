import { version } from '../../core/version';
import { format as _stringFormat } from '../../core/utils/string';
import warnings from './errors_warnings';
import { each } from '../../core/utils/iterator';

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

        triggers[eventInfo.name] = callbackGetter(name);
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

export function createResizeHandler(callback) {
    let timeout;
    const handler = function() {
        clearTimeout(timeout);
        timeout = setTimeout(callback, 100);
    };

    handler.dispose = function() {
        clearTimeout(timeout);
        return this;
    };

    return handler;
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
