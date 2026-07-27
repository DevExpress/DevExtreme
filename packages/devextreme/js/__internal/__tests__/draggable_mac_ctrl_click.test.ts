import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import devices from '@ts/core/m_devices';

import { createDraggable, disposeDraggable, fire } from './utils';

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

const setMac = (mac: boolean): void => {
  (devices.real as jest.Mock).mockReturnValue({ mac, deviceType: 'desktop', platform: 'generic' });
};

beforeEach(() => {
  document.body.innerHTML = '';
  setMac(false);
});

afterEach(disposeDraggable);

describe('Draggable macOS Ctrl+click (T1328053)', () => {
  it('should not start a drag when a mouse move follows a macOS Ctrl+click', () => {
    setMac(true);
    const onDragStart = jest.fn();
    const draggable = createDraggable({ onDragStart });
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown', { ctrlKey: true, pointerType: 'mouse' });
    fire(element, 'dxpointermove', { y: 40, pointerType: 'mouse' });

    expect(onDragStart).not.toHaveBeenCalled();
    expect(draggable.getDragInProgress()).toBe(false);
  });

  it('should still start a drag for a regular (non-Ctrl) click on macOS', () => {
    setMac(true);
    const onDragStart = jest.fn();
    const draggable = createDraggable({ onDragStart });
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown', { pointerType: 'mouse' });
    fire(element, 'dxpointermove', { y: 40, pointerType: 'mouse' });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(draggable.getDragInProgress()).toBe(true);
  });

  it('should still start a drag for a Ctrl+click on non-macOS platforms', () => {
    setMac(false);
    const onDragStart = jest.fn();
    const draggable = createDraggable({ onDragStart });
    const element = draggable.$element().get(0);

    fire(element, 'dxpointerdown', { ctrlKey: true, pointerType: 'mouse' });
    fire(element, 'dxpointermove', { y: 40, pointerType: 'mouse' });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(draggable.getDragInProgress()).toBe(true);
  });
});
