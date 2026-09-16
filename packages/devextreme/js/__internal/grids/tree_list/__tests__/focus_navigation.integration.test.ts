import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

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
