import '@js/common/core/events/gesture/emitter.gesture.scroll';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import eventsEngine from '@js/common/core/events/core/events_engine';

describe('EventManager gesture emitter lookup + Shadow DOM (T1329805)', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let container: HTMLElement;

  const dispatchWheelFrom = (el: EventTarget): void => {
    const event = new Event('wheel', { bubbles: true, composed: true, cancelable: true });
    Object.assign(event, {
      deltaY: 100, deltaX: 0, deltaZ: 0, deltaMode: 0,
    });
    el.dispatchEvent(event);
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    eventsEngine.off(container);
    container.remove();
  });

  it('finds the gesture emitter when the wheel originates from a regular descendant', () => {
    const child = document.createElement('div');
    container.appendChild(child);

    const onScrollInit = jest.fn();
    eventsEngine.on(container, 'dxscrollinit', onScrollInit);

    dispatchWheelFrom(child);

    expect(onScrollInit).toHaveBeenCalledTimes(1);
  });

  it('finds the gesture emitter when the wheel originates inside a Shadow DOM descendant', () => {
    const host = document.createElement('div');
    container.appendChild(host);
    const inner = document.createElement('div');
    host.attachShadow({ mode: 'open' }).appendChild(inner);

    const onScrollInit = jest.fn();
    eventsEngine.on(container, 'dxscrollinit', onScrollInit);

    dispatchWheelFrom(inner);

    expect(onScrollInit).toHaveBeenCalledTimes(1);
  });
});
