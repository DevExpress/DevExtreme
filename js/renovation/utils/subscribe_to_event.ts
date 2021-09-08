import eventsEngine from '../../events/core/events_engine';
import * as clickEvent from '../../events/click';
import { EffectReturn } from './effect_return.d';

export function subscribeToEvent(eventName: string) {
  return (element: HTMLElement | undefined | null, handler: unknown): EffectReturn => {
    if (handler && element) {
      eventsEngine.on(element, eventName, handler);
      return (): void => eventsEngine.off(element, eventName, handler);
    }
    return undefined;
  };
}
export const subscribeToClickEvent = subscribeToEvent(clickEvent.name);
export const subscribeToScrollEvent = subscribeToEvent('scroll');
