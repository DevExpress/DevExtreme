import {
  EVENT, emit, getEventHandlers, clear,
} from '../../test_utils/events_mock';
import { DisposeEffectReturn } from '../effect_return';

import { subscribeToClickEvent } from '../subscribe_to_event';

describe('subscribeToClickEvent', () => {
  afterEach(() => { clear(); });

  const element = {} as HTMLElement;

  it('should not subscribe to click event without handler', () => {
    subscribeToClickEvent(element, null);

    expect(getEventHandlers(EVENT.dxClick)).toBe(undefined);
  });

  it('should subscribe to click event', () => {
    const clickHandler = jest.fn();
    subscribeToClickEvent(element, clickHandler);
    expect(clickHandler).toHaveBeenCalledTimes(0);

    emit(EVENT.dxClick);
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should return unsubscribe function', () => {
    const clickHandler = jest.fn();
    const unsubscribeFn = subscribeToClickEvent(element, clickHandler);

    emit(EVENT.dxClick);
    expect(clickHandler).toHaveBeenCalledTimes(1);

    (unsubscribeFn as DisposeEffectReturn)();

    emit(EVENT.dxClick);
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
