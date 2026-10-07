import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import Draggable from '@js/ui/draggable';
import Sortable from '@js/ui/sortable';

interface DragParticipant {
  _setSourceDraggable: () => void;
  _resetSourceDraggable: () => void;
  _setTargetDraggable: () => void;
  _resetTargetDraggable: () => void;
  _getEventArgs: (event: object) => unknown;
  dragEnd: (args: unknown) => void;
}

beforeEach(() => {
  document.body.innerHTML = '<div id="source"><div>item</div></div><div id="target"></div>';
});

describe('Sortable onRemove', () => {
  it('should pass the drag end event, not the event args, when the target is a Draggable', () => {
    const onRemove = jest.fn();
    const sortable = new Sortable($('#source').get(0), { group: 'group', onRemove });
    const draggable = new Draggable($('#target').get(0), { group: 'group' });
    const source = sortable as unknown as DragParticipant;
    const target = draggable as unknown as DragParticipant;
    const dragEndEvent = { type: 'dxdragend' };

    source._setSourceDraggable();
    target._setTargetDraggable();

    try {
      target.dragEnd(source._getEventArgs(dragEndEvent));
    } finally {
      source._resetSourceDraggable();
      target._resetTargetDraggable();
      sortable.dispose();
      draggable.dispose();
    }

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect((onRemove.mock.calls[0][0] as { event: unknown }).event).toBe(dragEndEvent);
  });
});
