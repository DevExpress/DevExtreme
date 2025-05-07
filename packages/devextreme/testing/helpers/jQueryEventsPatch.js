/* global jQuery */

import eventsEngine from 'common/core/events/core/events_engine';

let originalJQueryEvent;
const originalJQueryMethods = {};

QUnit.testStart(function() {
    if(!jQuery) {
        return;
    }

    originalJQueryEvent = jQuery.Event;

    jQuery.Event = function() {
        return eventsEngine.Event.apply(this, arguments);
    };
    jQuery.Event.prototype = eventsEngine.Event.prototype;

    ['on', 'one', 'off', 'trigger', 'triggerHandler'].forEach(function(methodName) {
        originalJQueryMethods[methodName] = jQuery[methodName];

        const patchedMethod = function(events, selector, data) {
            const args = [].slice.call(arguments);
            eventsEngine[methodName].apply(this, [this].concat(args));

            return this;
        };

        if(methodName === 'on') {
            jQuery.fn.on = function(events, selector, data) {
                if(typeof events === 'object') {
                    for(const eventName in events) {
                        patchedMethod.call(this, eventName, selector, data, events[eventName]);
                    }
                    return this;
                }

                return patchedMethod.apply(this, arguments);
            };
        } else {
            jQuery.fn[methodName] = patchedMethod;
        }
    });
});

QUnit.testDone(function() {
    if(!jQuery) {
        return;
    }

    jQuery.Event = originalJQueryEvent;
    jQuery.fn.extend(originalJQueryMethods);
});
