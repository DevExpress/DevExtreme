import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { createDraggable, disposeDraggable, fire } from './utils';

const swipe = (target: Element): void => {
  fire(target, 'dxpointerdown');
  fire(target, 'dxpointermove', { y: 20 });
  fire(target, 'dxpointermove', { y: 40 });
  fire(target, 'dxpointerup', { y: 40 });
};

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(disposeDraggable);

describe('Draggable dragInProgress reset', () => {
  it('should reset dragInProgress when a drag is completed', () => {
    const draggable = createDraggable();

    swipe(draggable.$element().get(0));

    expect(draggable.getDragInProgress()).toBe(false);
  });

  it('should not set dragInProgress when the drag start is canceled by an invalid handle', () => {
    const draggable = createDraggable({ handle: '.handle' });
    const $draggableElement = draggable.$element();

    $('<span>').addClass('handle').appendTo($draggableElement);

    swipe($draggableElement.get(0));

    expect(draggable.getDragInProgress()).toBe(false);
  });

  it('should not set dragInProgress when the element is disabled', () => {
    const draggable = createDraggable();

    draggable.$element().addClass('dx-state-disabled');

    swipe(draggable.$element().get(0));

    expect(draggable.getDragInProgress()).toBe(false);
  });

  it('should not set dragInProgress when onDragStart cancels the drag', () => {
    const draggable = createDraggable({
      onDragStart: (e) => { e.cancel = true; },
    });

    swipe(draggable.$element().get(0));

    expect(draggable.getDragInProgress()).toBe(false);
  });
});

describe('Draggable preventDefault on a drag move', () => {
  it('should not prevent default on a drag move when no drag is in progress', () => {
    const draggable = createDraggable();
    const event = fire(draggable.$element().get(0), 'dxdrag');

    expect(event._cancelPreventDefault).toBe(true);
    expect(event.isDefaultPrevented()).toBe(false);
  });

  it('should prevent default on a drag move when a drag is in progress', () => {
    const draggable = createDraggable();
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown');
    const event = fire(element, 'dxpointermove', { y: 20 });

    expect(event._cancelPreventDefault).not.toBe(true);
    expect(event.isDefaultPrevented()).toBe(true);
  });
});
