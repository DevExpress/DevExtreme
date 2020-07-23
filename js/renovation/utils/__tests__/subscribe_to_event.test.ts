import {
  EVENT, emit, getEventHandlers, clear,
} from '../../__tests__/events_mock';
import { subscribeDxClick } from '../subscribe_to_event';

describe('subscribeToClickEvent', () => {
  afterEach(() => { clear(); });

  const element = {} as HTMLElement;

  it('should not subscribe to click event without handler', () => {
    subscribeDxClick(element);

    expect(getEventHandlers(EVENT.dxClick)).toBe(undefined);
  });

  it('should subscribe to click event', () => {
    const clickHandler = jest.fn();
    subscribeDxClick(element, clickHandler);
    expect(clickHandler).toHaveBeenCalledTimes(0);

    emit(EVENT.dxClick);
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should return unsubscribe function', () => {
    const clickHandler = jest.fn();
    const unsubscribeFn = subscribeDxClick(element, clickHandler);

    emit(EVENT.dxClick);
    expect(clickHandler).toHaveBeenCalledTimes(1);

        unsubscribeFn?.();

        emit(EVENT.dxClick);
        expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
