import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { flushAsync } from '../../grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createTreeList,
} from './__mock__/helpers/utils';

// A three-level tree: 1 > 11 > 111, and a sibling branch 2 > 21.
const DATA = [
  { id: 1, parentId: 0, name: 'root A' },
  { id: 11, parentId: 1, name: 'child A1' },
  { id: 111, parentId: 11, name: 'leaf A1a' },
  { id: 2, parentId: 0, name: 'root B' },
  { id: 21, parentId: 2, name: 'child B1' },
];

const visibleKeys = (
  instance: Awaited<ReturnType<typeof createTreeList>>['instance'],
): unknown[] => instance.getVisibleRows().map((row) => row.key);

describe('TreeList focus — navigating to the focused row', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('expands every ancestor of the focused row', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      focusedRowEnabled: true,
      autoExpandAll: false,
    });
    await flushAsync();

    expect(visibleKeys(instance)).toEqual([1, 2]);

    instance.option('focusedRowKey', 111);
    await flushAsync();

    expect(instance.isRowExpanded(1)).toBe(true);
    expect(instance.isRowExpanded(11)).toBe(true);
    expect(visibleKeys(instance)).toContain(111);
  });

  it('leaves an unrelated branch collapsed', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      focusedRowEnabled: true,
      autoExpandAll: false,
    });
    await flushAsync();

    instance.option('focusedRowKey', 111);
    await flushAsync();

    expect(instance.isRowExpanded(2)).toBe(false);
    expect(visibleKeys(instance)).not.toContain(21);
  });

  it('reports no focused row for a key that does not exist', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      focusedRowEnabled: true,
      autoExpandAll: false,
    });
    await flushAsync();

    instance.option('focusedRowKey', 999);
    await flushAsync();

    expect(instance.option('focusedRowIndex')).toBe(-1);
  });

  it('focuses a root row without expanding anything', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      focusedRowEnabled: true,
      autoExpandAll: false,
    });
    await flushAsync();

    instance.option('focusedRowKey', 2);
    await flushAsync();

    expect(instance.isRowExpanded(1)).toBe(false);
    expect(instance.isRowExpanded(2)).toBe(false);
    expect(instance.option('focusedRowIndex')).toBe(1);
  });
});

describe('TreeList focus — partial update of the focused row', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('keeps DOM focus on the focused cell when the focused row is expanded with repaintChangesOnly (T1338023)', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      columns: ['id', 'name'],
      focusedRowEnabled: true,
      focusedRowKey: 1,
      repaintChangesOnly: true,
      autoExpandAll: false,
    });
    await flushAsync();

    const cell = instance.getCellElement(0, 'name') as HTMLElement;
    instance.focus(cell);
    await flushAsync();
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }));

    expect(document.activeElement).toBe(cell);

    const expanding = instance.expandRow(1);
    await flushAsync();
    await expanding;

    expect(visibleKeys(instance)).toEqual([1, 11, 2]);
    expect(cell.hasAttribute('tabindex')).toBe(true);
    expect(document.activeElement).toBe(cell);
  });

  it('keeps the focused row tab stop when the focused row is expanded with repaintChangesOnly (T1338023)', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      columns: ['id', 'name'],
      focusedRowEnabled: true,
      focusedRowKey: 1,
      repaintChangesOnly: true,
      autoExpandAll: false,
      tabIndex: 3,
    });
    await flushAsync();

    const row = $(instance.getRowElement(0)).get(0) as HTMLElement;
    instance.focus(row);
    await flushAsync();
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }));

    expect(document.activeElement).toBe(row);

    const expanding = instance.expandRow(1);
    await flushAsync();
    await expanding;

    expect(visibleKeys(instance)).toEqual([1, 11, 2]);
    expect(row.getAttribute('tabindex')).toBe('3');
  });
});
