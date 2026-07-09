import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';
import Draggable from '@js/ui/draggable';

jest.mock('@ts/core/m_devices', () => {
  const originalModule: any = jest.requireActual('@ts/core/m_devices');
  const device = { mac: false, deviceType: 'desktop', platform: 'generic' };

  return {
    __esModule: true,
    default: {
      ...originalModule.default,
      isSimulator: originalModule.default.isSimulator,
      real: jest.fn().mockReturnValue(device),
      current: jest.fn().mockReturnValue(device),
    },
  };
});

// eslint-disable-next-line import/first
import devices from '@ts/core/m_devices';

const DRAGGABLE_ELEMENT_ID = 'draggable';

interface DraggableTest extends Draggable {
  getDragInProgress: () => boolean;
}

const setMac = (mac: boolean): void => {
  (devices.real as jest.Mock).mockReturnValue({ mac, deviceType: 'desktop', platform: 'generic' });
};

const fire = (
  element: Element,
  type: string,
  { x = 0, y = 0, ctrlKey = false }: { x?: number; y?: number; ctrlKey?: boolean } = {},
): void => {
  // @ts-expect-error -- Event is absent from the public eventsEngine type
  const event = eventsEngine.Event({
    type,
    pageX: x,
    pageY: y,
    clientX: x,
    clientY: y,
    offset: { x, y },
    pointerType: 'mouse',
    pointers: type === 'dxpointerup' ? [] : [{ pointerId: 1 }],
    pointerId: 1,
    which: 1,
    ctrlKey,
  });

  // @ts-expect-error -- trigger is absent from the public eventsEngine type
  eventsEngine.trigger(element, event);
};

const createDraggable = (options: Record<string, unknown> = {}): DraggableTest => {
  const $element = $('<div>')
    .attr('id', DRAGGABLE_ELEMENT_ID)
    .css({ width: '100px', height: '40px' })
    .appendTo(document.body);

  return new Draggable($element.get(0), { autoScroll: false, ...options }) as DraggableTest;
};

beforeEach(() => {
  document.body.innerHTML = '';
  setMac(false);
});

afterEach(() => {
  const instance = Draggable.getInstance($(`#${DRAGGABLE_ELEMENT_ID}`).get(0));

  instance?.dispose();
});

describe('Draggable macOS Ctrl+click (T1328053)', () => {
  it('should not start a drag when a mouse move follows a macOS Ctrl+click', () => {
    setMac(true);
    const onDragStart = jest.fn();
    const draggable = createDraggable({ onDragStart });
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown', { x: 0, y: 0, ctrlKey: true });
    fire(element, 'dxpointermove', { x: 0, y: 40 });

    expect(onDragStart).not.toHaveBeenCalled();
    expect(draggable.getDragInProgress()).toBe(false);
  });

  it('should still start a drag for a regular (non-Ctrl) click on macOS', () => {
    setMac(true);
    const onDragStart = jest.fn();
    const draggable = createDraggable({ onDragStart });
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown', { x: 0, y: 0 });
    fire(element, 'dxpointermove', { x: 0, y: 40 });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(draggable.getDragInProgress()).toBe(true);
  });

  it('should still start a drag for a Ctrl+click on non-macOS platforms', () => {
    setMac(false);
    const onDragStart = jest.fn();
    const draggable = createDraggable({ onDragStart });
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown', { x: 0, y: 0, ctrlKey: true });
    fire(element, 'dxpointermove', { x: 0, y: 40 });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(draggable.getDragInProgress()).toBe(true);
  });
});
