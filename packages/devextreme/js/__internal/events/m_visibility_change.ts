import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';

const triggerVisibilityChangeEvent = function (eventName) {
  const VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';

  return function (element) {
    const $element = $(element || 'body');

    const changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR)
    // @ts-expect-error
      .add($element.find(VISIBILITY_CHANGE_SELECTOR));

    for (let i = 0; i < changeHandlers.length; i++) {
      eventsEngine.triggerHandler(changeHandlers[i], eventName);
    }
  };
};

export const triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export const triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');

export default {
  triggerHidingEvent,
  triggerResizeEvent,
  triggerShownEvent,
};
