import each from 'jest-each';
import {
  EVENT, emit, getEventHandlers, clear,
} from '../../test_utils/events_mock';
import { DisposeEffectReturn } from '../effect_return';

import {
  subscribeToClickEvent,
  subscribeToScrollEvent,
  subscribeToDXScrollStartEvent,
  subscribeToDXScrollMoveEvent,
  subscribeToDXScrollEndEvent,
  subscribeToDXScrollCancelEvent,
  subscribeToDXScrollStopEvent,
  subscribeToDXPointerDownEvent,
  subscribeToDXPointerUpEvent,
  subscribeToKeyDownEvent,
  subscribeToMouseEnterEvent,
  subscribeToMouseLeaveEvent,
  subscribeToDXPointerMoveEvent,
} from '../subscribe_to_event';

describe('subscribeToEvent', () => {
  afterEach(() => { clear(); });

  const element = {} as HTMLElement;

  each([
    { name: EVENT.dxClick, subscribeFn: subscribeToClickEvent },
    { name: EVENT.scroll, subscribeFn: subscribeToScrollEvent },
    { name: EVENT.scrollStart, subscribeFn: subscribeToDXScrollStartEvent },
    { name: EVENT.scrollMove, subscribeFn: subscribeToDXScrollMoveEvent },
    { name: EVENT.scrollEnd, subscribeFn: subscribeToDXScrollEndEvent },
    { name: EVENT.scrollCancel, subscribeFn: subscribeToDXScrollCancelEvent },
    { name: EVENT.scrollStop, subscribeFn: subscribeToDXScrollStopEvent },
    { name: EVENT.pointerDown, subscribeFn: subscribeToDXPointerDownEvent },
    { name: EVENT.pointerUp, subscribeFn: subscribeToDXPointerUpEvent },
    { name: EVENT.pointerMove, subscribeFn: subscribeToDXPointerMoveEvent },
    { name: 'keydown', subscribeFn: subscribeToKeyDownEvent },
    { name: 'mouseenter', subscribeFn: subscribeToMouseEnterEvent },
    { name: 'mouseleave', subscribeFn: subscribeToMouseLeaveEvent },
  ]).describe('event: %o', (event) => {
    it(`should not subscribe to ${event.name} event without handler`, () => {
      event.subscribeFn(element, null);

      expect(getEventHandlers(event.name)).toBe(undefined);
    });

    it(`should subscribe to ${event.name} event`, () => {
      const handler = jest.fn();
      event.subscribeFn(element, handler);
      expect(handler).toHaveBeenCalledTimes(0);

      emit(event.name);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const handler = jest.fn();

      const unsubscribeFn = event.subscribeFn(element, handler);
      emit(event.name);
      expect(handler).toHaveBeenCalledTimes(1);

      (unsubscribeFn as DisposeEffectReturn)();

      emit(event.name);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
