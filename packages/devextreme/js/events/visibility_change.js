import $ from '../core/renderer';
import eventsEngine from './core/events_engine';

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


export const triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export const triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');
