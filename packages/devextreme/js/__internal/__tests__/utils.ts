import $ from '@js/core/renderer';
import Draggable from '@js/ui/draggable';
import type { EngineEvent } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';

export const DRAGGABLE_ELEMENT_ID = 'draggable';

export interface DraggableTest extends Draggable {
  getDragInProgress: () => boolean;
}

export type FiredEvent = EngineEvent & {
  _cancelPreventDefault?: boolean;
};

interface FireOptions {
  x?: number;
  y?: number;
  ctrlKey?: boolean;
  key?: string;
  pointerType?: 'mouse' | 'touch';
}

export const fire = (
  element: Element,
  type: string,
  {
    x = 0, y = 0, ctrlKey = false, key, pointerType = 'touch',
  }: FireOptions = {},
): FiredEvent => {
  const event: FiredEvent = eventsEngine.Event({
    type,
    pageX: x,
    pageY: y,
    clientX: x,
    clientY: y,
    offset: { x, y },
    pointerType,
    pointers: type === 'dxpointerup' ? [] : [{ pointerId: 1 }],
    pointerId: 1,
    which: 1,
    ctrlKey,
    key,
  });

  eventsEngine.trigger(element, event);

  return event;
};

export const createDraggable = (options: Record<string, unknown> = {}): DraggableTest => {
  const $element = $('<div>')
    .attr('id', DRAGGABLE_ELEMENT_ID)
    .css({ width: '100px', height: '40px' })
    .appendTo(document.body);

  return new Draggable($element.get(0), { autoScroll: false, ...options }) as DraggableTest;
};

export const disposeDraggable = (): void => {
  const instance = Draggable.getInstance($(`#${DRAGGABLE_ELEMENT_ID}`).get(0));

  instance?.dispose();
};
