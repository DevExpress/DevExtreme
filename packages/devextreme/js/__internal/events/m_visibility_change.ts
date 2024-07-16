import $ from '@js/core/renderer';
import eventsEngine from '@js/events/core/events_engine';

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

const triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
const triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');

export {
  triggerHidingEvent,
  triggerResizeEvent,
  triggerShownEvent,
};
