import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { ResizableModel } from '@ts/ui/__tests__/__mock__/model/resizable';

import Resizable, { type ResizableProperties } from '../resizable';

const resizables: Resizable[] = [];

const createResizable = (options: Partial<ResizableProperties> = {}): ResizableModel => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance = new Resizable($element, options);

  resizables.push(instance);

  return new ResizableModel($element.get(0) as HTMLElement);
};

describe('Resizable cancelOnEscape', () => {
  afterEach(() => {
    resizables.forEach((instance) => instance.dispose());
    resizables.length = 0;
    document.body.innerHTML = '';
  });

  it('should stop resizing and clear the resizing state when Escape is pressed', () => {
    const model = createResizable({ cancelOnEscape: true });

    model.startResize();
    model.moveResize();
    model.pressEscape();

    expect(model.isResizing()).toBe(false);
  });

  it('should not fire onResizeEnd when the resize is canceled by Escape', () => {
    const onResizeEnd = jest.fn();
    const model = createResizable({ cancelOnEscape: true, onResizeEnd });

    model.startResize();
    model.moveResize();
    model.pressEscape();

    expect(onResizeEnd).not.toHaveBeenCalled();
  });

  it('should keep resizing when Escape is pressed and cancelOnEscape is disabled', () => {
    const model = createResizable({ cancelOnEscape: false });

    model.startResize();
    model.moveResize();
    model.pressEscape();

    expect(model.isResizing()).toBe(true);
  });

  it('should fire onResizeEnd and clear the resizing state on a normal resize', () => {
    const onResizeEnd = jest.fn();
    const model = createResizable({ cancelOnEscape: true, onResizeEnd });

    model.startResize();
    model.moveResize();
    model.endResize();

    expect(onResizeEnd).toHaveBeenCalledTimes(1);
    expect(model.isResizing()).toBe(false);
  });

  it('should ignore Escape when there is no active resize', () => {
    const onResizeEnd = jest.fn();
    const model = createResizable({ cancelOnEscape: true, onResizeEnd });

    model.pressEscape();

    expect(model.isResizing()).toBe(false);
    expect(onResizeEnd).not.toHaveBeenCalled();
  });
});
