import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';

const TREELIST_CONTAINER_ID = 'treeListContainer';

const DATA = [
  { id: 1, parentId: 0, name: 'root A' },
  { id: 11, parentId: 1, name: 'child A1' },
  { id: 111, parentId: 11, name: 'leaf A1a' },
  { id: 2, parentId: 0, name: 'root B' },
  { id: 21, parentId: 2, name: 'child B1' },
];

const flushAsync = async (): Promise<void> => {
  jest.runAllTimers();
  await Promise.resolve();
};

const createTreeList = (options: TreeListProperties = {}): { instance: TreeList } => {
  const $container = $('<div>')
    .attr('id', TREELIST_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new TreeList($container.get(0) as HTMLDivElement, {
    keyExpr: 'id',
    ...options,
  });

  jest.runAllTimers();

  return { instance };
};

const visibleKeys = (instance: TreeList): unknown[] => instance
  .getVisibleRows()
  .map((row) => row.key);

describe('TreeList focus — partial update of the focused row', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    const $container = $(`#${TREELIST_CONTAINER_ID}`);

    (TreeList.getInstance($container.get(0) as HTMLElement) as TreeList)?.dispose();
    $container.remove();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('keeps DOM focus on the focused cell when the focused row is expanded with repaintChangesOnly (T1338023)', async () => {
    const { instance } = createTreeList({
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
    const { instance } = createTreeList({
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
