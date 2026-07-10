import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { isContextMenuKeyEvent } from './cell_context_menu';

describe('isContextMenuKeyEvent', () => {
  it('should detect the ContextMenu key', () => {
    expect(isContextMenuKeyEvent({ key: 'ContextMenu', shiftKey: false })).toBe(true);
  });

  it('should detect the ContextMenu key regardless of the Shift state', () => {
    expect(isContextMenuKeyEvent({ key: 'ContextMenu', shiftKey: true })).toBe(true);
  });

  it('should detect Shift+F10', () => {
    expect(isContextMenuKeyEvent({ key: 'F10', shiftKey: true })).toBe(true);
  });

  it('should ignore F10 without Shift', () => {
    expect(isContextMenuKeyEvent({ key: 'F10', shiftKey: false })).toBe(false);
  });

  it('should ignore Shift without F10', () => {
    expect(isContextMenuKeyEvent({ key: 'Shift', shiftKey: true })).toBe(false);
  });

  it('should ignore unrelated keys', () => {
    expect(isContextMenuKeyEvent({ key: 'Enter', shiftKey: false })).toBe(false);
    expect(isContextMenuKeyEvent({ key: 'ArrowDown', shiftKey: false })).toBe(false);
    expect(isContextMenuKeyEvent({ key: ' ', shiftKey: false })).toBe(false);
  });
});
