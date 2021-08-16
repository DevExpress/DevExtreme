import eventsEngine from '../../events/core/events_engine';
import * as clickEvent from '../../events/click';
import { EffectReturn } from './effect_return.d';
import scrollEvents from '../../events/gesture/emitter.gesture.scroll';
import pointerEvents from '../../events/pointer';

export function subscribeToEvent(eventName: string) {
  return (
    element: HTMLElement | Document | undefined | null,
    handler: unknown,
    eventData?: unknown,
  ): EffectReturn => {
    if (handler && element) {
      eventsEngine.on(element, eventName, eventData, handler);
      return (): void => {
        eventsEngine.off(element, eventName, handler);
      };
    }
    return undefined;
  };
}
export const subscribeToClickEvent = subscribeToEvent(clickEvent.name);

export const subscribeToScrollEvent = subscribeToEvent(scrollEvents.scroll);
export const subscribeToScrollInitEvent = subscribeToEvent(scrollEvents.init);
export const subscribeToDXScrollStartEvent = subscribeToEvent(scrollEvents.start);
export const subscribeToDXScrollMoveEvent = subscribeToEvent(scrollEvents.move);
export const subscribeToDXScrollEndEvent = subscribeToEvent(scrollEvents.end);
export const subscribeToDXScrollStopEvent = subscribeToEvent(scrollEvents.stop);
export const subscribeToDXScrollCancelEvent = subscribeToEvent(scrollEvents.cancel);

export const subscribeToDXPointerDownEvent = subscribeToEvent(pointerEvents.down);
export const subscribeToDXPointerUpEvent = subscribeToEvent(pointerEvents.up);

export const subscribeToKeyDownEvent = subscribeToEvent('keydown');
