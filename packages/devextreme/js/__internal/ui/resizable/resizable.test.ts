import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import eventsEngine from '@ts/events/core/m_events_engine';

import Resizable, { type ResizableProperties } from './resizable';

const HANDLE_BOTTOM_CLASS = 'dx-resizable-handle-bottom';

const instances: Resizable[] = [];

const createResizable = (options: Partial<ResizableProperties> = {}): {
  instance: Resizable;
  $element: ReturnType<typeof $>;
  $handle: ReturnType<typeof $>;
} => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance = new Resizable($element, options);
  const $handle = $element.find(`.${HANDLE_BOTTOM_CLASS}`);

  instances.push(instance);

  return { instance, $element, $handle };
};

const startResize = ($handle: ReturnType<typeof $>): void => {
  eventsEngine.trigger($handle, { type: 'dxdragstart', target: $handle.get(0) });
};

const moveResize = ($handle: ReturnType<typeof $>): void => {
  eventsEngine.trigger($handle, { type: 'dxdrag', target: $handle.get(0), offset: { x: 0, y: 10 } });
};

const endResize = ($handle: ReturnType<typeof $>): void => {
  eventsEngine.trigger($handle, { type: 'dxdragend', target: $handle.get(0) });
};

const pressEscape = ($element: ReturnType<typeof $>): void => {
  eventsEngine.trigger($element, { type: 'keydown', key: 'Escape' });
};

describe('Resizable onCancelByEsc', () => {
  beforeEach(() => {
    $('<div>').addClass('root').appendTo(document.body);
  });

  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
    document.body.innerHTML = '';
  });

  it('should fire onResizeCancel when Escape is pressed during resize', () => {
    const onResizeCancel = jest.fn();
    const { $element, $handle } = createResizable({ onCancelByEsc: true, onResizeCancel });

    startResize($handle);
    moveResize($handle);
    pressEscape($element);

    expect(onResizeCancel).toHaveBeenCalledTimes(1);
  });

  it('should not fire onResizeEnd when resize is cancelled by Escape', () => {
    const onResizeEnd = jest.fn();
    const { $element, $handle } = createResizable({ onCancelByEsc: true, onResizeEnd });

    startResize($handle);
    moveResize($handle);
    pressEscape($element);
    endResize($handle);

    expect(onResizeEnd).not.toHaveBeenCalled();
  });

  it('should fire onResizeEnd normally when resize is completed without Escape', () => {
    const onResizeEnd = jest.fn();
    const { $handle } = createResizable({ onCancelByEsc: true, onResizeEnd });

    startResize($handle);
    moveResize($handle);
    endResize($handle);

    expect(onResizeEnd).toHaveBeenCalledTimes(1);
  });

  it('should ignore Escape when onCancelByEsc is disabled', () => {
    const onResizeCancel = jest.fn();
    const onResizeEnd = jest.fn();
    const { $element, $handle } = createResizable({ onResizeCancel, onResizeEnd });

    startResize($handle);
    moveResize($handle);
    pressEscape($element);
    endResize($handle);

    expect(onResizeCancel).not.toHaveBeenCalled();
    expect(onResizeEnd).toHaveBeenCalledTimes(1);
  });

  it('should not fire onResizeCancel when Escape is pressed without an active resize', () => {
    const onResizeCancel = jest.fn();
    const { $element } = createResizable({ onCancelByEsc: true, onResizeCancel });

    pressEscape($element);

    expect(onResizeCancel).not.toHaveBeenCalled();
  });
});
