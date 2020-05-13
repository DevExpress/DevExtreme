const $ = require('../core/renderer');
const eventsEngine = require('./core/events_engine');

const triggerVisibilityChangeEvent = function(eventName) {
    const VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';

    return function(element) {
        const $element = $(element || 'body');

        const changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR).
            add($element.find(VISIBILITY_CHANGE_SELECTOR));

        for(let i = 0; i < changeHandlers.length; i++) {
            eventsEngine.triggerHandler(changeHandlers[i], eventName);
        }
    };
};


exports.triggerShownEvent = triggerVisibilityChangeEvent('dxshown'); // TODO: extract to events
exports.triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding'); // TODO: extract to events
exports.triggerResizeEvent = triggerVisibilityChangeEvent('dxresize'); // TODO: extract to events
