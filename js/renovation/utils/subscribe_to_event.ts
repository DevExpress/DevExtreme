import eventsEngine from '../../events/core/events_engine';
import * as clickEvent from '../../events/click';
import { DisposeEffectReturn } from './effect_return';

export function subscribeToEvent(eventName: string) {
  return (element: HTMLElement, handler): DisposeEffectReturn => {
    if (handler) {
      eventsEngine.on(element, eventName, handler);
      return (): void => eventsEngine.off(element, clickEvent.name, handler);
    }
    return undefined;
  };
}
export const subscribeToClickEvent = subscribeToEvent(clickEvent.name);
