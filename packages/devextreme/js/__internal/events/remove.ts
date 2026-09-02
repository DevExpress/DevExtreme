import registerEvent from '@js/common/core/events/core/event_registrator';
import { beforeCleanData } from '@js/core/element_data';
import $ from '@js/core/renderer';
import type { EngineTarget } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';

export const removeEvent = 'dxremove';
const eventPropName = 'dxRemoveEvent';

beforeCleanData((elements: ArrayLike<Node>): void => {
  Array.from(elements).forEach((element) => {
    if (Reflect.get(element, eventPropName)) {
      Reflect.set(element, eventPropName, null);
      eventsEngine.triggerHandler(element, removeEvent);
    }
  });
});

registerEvent(removeEvent, {
  noBubble: true,
  setup(element: EngineTarget): void {
    $(element).prop(eventPropName, true);
  },
});
