import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import eventsEngine from '@js/common/core/events/core/events_engine';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Draggable from '@js/ui/draggable';

const DRAGGABLE_ELEMENT_ID = 'draggable';

interface DraggableTest extends Draggable {
  getDragInProgress: () => boolean;
}

interface FiredEvent {
  _cancelPreventDefault?: boolean;
  isDefaultPrevented: () => boolean;
}

const fire = (element: Element, type: string, x = 0, y = 0): FiredEvent => {
  // @ts-expect-error -- Event is absent from the public eventsEngine type
  const event: FiredEvent = eventsEngine.Event({
    type,
    pageX: x,
    pageY: y,
    clientX: x,
    clientY: y,
    offset: { x, y },
    pointerType: 'touch',
    pointers: type === 'dxpointerup' ? [] : [{ pointerId: 1 }],
    pointerId: 1,
    which: 1,
  });

  // @ts-expect-error -- trigger is absent from the public eventsEngine type
  eventsEngine.trigger(element, event);

  return event;
};

const swipe = (target: Element): void => {
  fire(target, 'dxpointerdown', 0, 0);
  fire(target, 'dxpointermove', 0, 20);
  fire(target, 'dxpointermove', 0, 40);
  fire(target, 'dxpointerup', 0, 40);
};

const appendElement = (): dxElementWrapper => $('<div>')
  .attr('id', DRAGGABLE_ELEMENT_ID)
  .css({ width: '100px', height: '40px' })
  .appendTo(document.body);

const createDraggable = (options: Record<string, unknown> = {}): DraggableTest => {
  const $element = appendElement();

  return new Draggable($element.get(0), { autoScroll: false, ...options }) as DraggableTest;
};

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  const instance = Draggable.getInstance($(`#${DRAGGABLE_ELEMENT_ID}`).get(0));

  instance?.dispose();
});

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

    fire(element, 'dxpointerdown', 0, 0);
    const event = fire(element, 'dxpointermove', 0, 20);

    expect(event._cancelPreventDefault).not.toBe(true);
    expect(event.isDefaultPrevented()).toBe(true);
  });
});
