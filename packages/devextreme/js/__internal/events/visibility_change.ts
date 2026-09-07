import $ from '@js/core/renderer';
import eventsEngine from '@ts/events/core/events_engine';

const VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';

export type VisibilityChangeTarget = Parameters<typeof $>[0];

const triggerVisibilityChangeEvent = (
  eventName: string,
) => (element?: VisibilityChangeTarget): void => {
  const $element = $(element || 'body');

  const changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR)
    .add($element.find(VISIBILITY_CHANGE_SELECTOR));

  changeHandlers.toArray().forEach((changeHandler) => {
    eventsEngine.triggerHandler(changeHandler, eventName);
  });
};

export const triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export const triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');

export default {
  triggerHidingEvent,
  triggerResizeEvent,
  triggerShownEvent,
};
