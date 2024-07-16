/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-plusplus */

import $ from '@js/core/renderer';
import eventsEngine from '@js/events/core/events_engine';

const triggerVisibilityChangeEvent = function (eventName: any): (element: Element) => void {
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

export { triggerVisibilityChangeEvent };
