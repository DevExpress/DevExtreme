import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import eventsEngine from '@ts/events/core/events_engine';

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

const click = (element: Element): void => {
  eventsEngine.trigger(element, 'dxpointerdown');
  eventsEngine.trigger(element, 'dxpointerup');
  eventsEngine.trigger(element, 'dxclick');
};

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
    expect($(instance.getRowElement(0)).get(0).hasAttribute('tabindex')).toBe(false);
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

    const row = $(instance.getRowElement(0)).get(0);
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

  it('never removes the tab stop from the focused row while it is expanded with repaintChangesOnly (T1338023)', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      columns: ['id', 'name'],
      focusedRowEnabled: true,
      focusedRowKey: 1,
      repaintChangesOnly: true,
      autoExpandAll: false,
    });
    await flushAsync();

    const row = $(instance.getRowElement(0)).get(0);
    instance.focus(row);
    await flushAsync();
    const removeAttribute = jest.spyOn(row, 'removeAttribute');

    const expanding = instance.expandRow(1);
    await flushAsync();
    await expanding;

    expect(visibleKeys(instance)).toEqual([1, 11, 2]);
    expect(removeAttribute).not.toHaveBeenCalledWith('tabindex');
    expect(document.activeElement).toBe(row);
  });

  it('moves the tab stop from the first row to the focused row when its hidden focused row is expanded (T1338023)', async () => {
    const { instance } = await createTreeList({
      dataSource: [
        { id: 1, parentId: 0, name: 'root A' },
        { id: 2, parentId: 0, name: 'root B' },
        { id: 21, parentId: 2, name: 'child B1' },
        { id: 3, parentId: 0, name: 'root C' },
      ],
      columns: ['id', 'name'],
      focusedRowEnabled: true,
      focusedRowKey: 21,
      autoNavigateToFocusedRow: false,
      repaintChangesOnly: true,
      autoExpandAll: false,
    });
    await flushAsync();

    instance.repaint();
    await flushAsync();

    expect($(instance.getRowElement(0)).get(0).hasAttribute('tabindex')).toBe(true);

    const expanding = instance.expandRow(2);
    await flushAsync();
    await expanding;

    expect(visibleKeys(instance)).toEqual([1, 2, 21, 3]);
    expect($(instance.getRowElement(0)).get(0).hasAttribute('tabindex')).toBe(false);
    expect($(instance.getRowElement(2)).get(0).hasAttribute('tabindex')).toBe(true);
  });

  it('keeps DOM focus on the focused cell when another row is updated via push (T1338023)', async () => {
    const { instance } = await createTreeList({
      dataSource: {
        store: {
          type: 'array',
          key: 'id',
          data: DATA.map((item) => ({ ...item })),
        },
        pushAggregationTimeout: 0,
      },
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

    instance.getDataSource().store().push([{ type: 'update', key: 2, data: { name: 'root B updated' } }]);
    await flushAsync();

    expect($(instance.getCellElement(1, 'name')).text()).toBe('root B updated');
    expect(cell.hasAttribute('tabindex')).toBe(true);
    expect($(instance.getRowElement(0)).get(0).hasAttribute('tabindex')).toBe(false);
    expect(document.activeElement).toBe(cell);
  });

  it('keeps the pointer focus state of the focused row when it is expanded with repaintChangesOnly (T1338023)', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      columns: ['id', 'name'],
      focusedRowEnabled: true,
      repaintChangesOnly: true,
      autoExpandAll: false,
    });
    await flushAsync();

    const row = $(instance.getRowElement(0)).get(0);
    click(instance.getCellElement(0, 'name') as HTMLElement);
    await flushAsync();

    expect(instance.option('focusedRowKey')).toBe(1);
    expect(row.classList.contains('dx-cell-focus-disabled')).toBe(true);

    const expanding = instance.expandRow(1);
    await flushAsync();
    await expanding;

    expect(visibleKeys(instance)).toEqual([1, 11, 2]);
    expect(row.classList.contains('dx-cell-focus-disabled')).toBe(true);
    expect(row.classList.contains('dx-focused')).toBe(false);
  });
});
