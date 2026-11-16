import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  group: index < 6 ? 'A' : 'B',
}));

const NESTED_DATA = DATA.map((row) => ({
  ...row,
  subgroup: [1, 2, 3, 7, 8, 9].includes(row.id) ? 'x' : 'y',
}));

describe('DataGrid focus', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('navigateToRow', () => {
    it('counts group rows when it picks the page in a grouped grid', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        columns: ['id', { dataField: 'group', groupIndex: 0 }],
        paging: { pageSize: 4 },
      });
      await flushAsync();

      const navigatePromise = instance.navigateToRow(10);
      await flushAsync();
      await navigatePromise;

      expect(instance.pageIndex()).toBe(3);
      expect(instance.getRowIndexByKey(10)).toBeGreaterThanOrEqual(0);
    });

    it('expands every group level on the path to a row in collapsed nested groups', async () => {
      const { instance } = await createDataGrid({
        dataSource: NESTED_DATA,
        keyExpr: 'id',
        columns: ['id', { dataField: 'group', groupIndex: 0 }, { dataField: 'subgroup', groupIndex: 1 }],
        grouping: { autoExpandAll: false },
        paging: { pageSize: 4 },
      });
      await flushAsync();

      const navigatePromise = instance.navigateToRow(11);
      await flushAsync();
      await navigatePromise;

      expect(instance.isRowExpanded(['B'])).toBe(true);
      expect(instance.isRowExpanded(['B', 'y'])).toBe(true);
      expect(instance.pageIndex()).toBe(1);
      const visibleRows = instance.getVisibleRows()
        .map(({ rowType, key }): unknown[] => [rowType, key]);
      expect(visibleRows).toEqual([
        ['group', ['B']], ['group', ['B', 'y']], ['data', 10], ['data', 11],
      ]);
    });

    it('picks the page by the data index in a flat grid', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        columns: ['id', 'group'],
        paging: { pageSize: 4 },
      });
      await flushAsync();

      const navigatePromise = instance.navigateToRow(10);
      await flushAsync();
      await navigatePromise;

      expect(instance.pageIndex()).toBe(2);
      expect(instance.getRowIndexByKey(10)).toBeGreaterThanOrEqual(0);
    });
  });
});
