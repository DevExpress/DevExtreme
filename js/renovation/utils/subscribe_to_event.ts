import eventsEngine from '../../events/core/events_engine';
import * as clickEvent from '../../events/click';
import { EffectReturn } from './effect_return';
import { addNamespace } from '../../events/utils/index';
import scrollEvents from '../../events/gesture/emitter.gesture.scroll';
import pointerEvents from '../../events/pointer';

export function subscribeToEvent(eventName: string) {
  return (
    element: HTMLElement | Document | undefined | null,
    handler: unknown,
    eventData?: unknown,
    namespace?: string,
  ): EffectReturn => {
    const event = namespace ? addNamespace(eventName, namespace) : eventName;
    if (handler) {
      eventsEngine.on(element, event, eventData, handler);
      return (): void => {
        eventsEngine.off(element, event, handler);
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
export const subscribeToDXPointerMoveEvent = subscribeToEvent(pointerEvents.move);

export const subscribeToMouseEnterEvent = subscribeToEvent('mouseenter');
export const subscribeToMouseLeaveEvent = subscribeToEvent('mouseleave');

export const subscribeToKeyDownEvent = subscribeToEvent('keydown');

export const subscribeToDxActiveEvent = subscribeToEvent('dxactive');
export const subscribeToDxInactiveEvent = subscribeToEvent('dxinactive');
export const subscribeToDxHoverStartEvent = subscribeToEvent('dxhoverstart');
export const subscribeToDxHoverEndEvent = subscribeToEvent('dxhoverend');
export const subscribeToDxFocusInEvent = subscribeToEvent('focusin');
export const subscribeToDxFocusOutEvent = subscribeToEvent('focusout');
