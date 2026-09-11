import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, group: 'A', value: 10 },
  { id: 2, group: 'A', value: 20 },
  { id: 3, group: 'B', value: 30 },
];

const createGroupedGrid = async (
  autoExpandAll = true,
): ReturnType<typeof createDataGrid> => createDataGrid({
  dataSource: DATA,
  columns: [{ dataField: 'group', groupIndex: 0 }, 'value'],
  grouping: { autoExpandAll },
  paging: { enabled: false },
});

const groupRowKeys = (
  instance: Awaited<ReturnType<typeof createDataGrid>>['instance'],
): unknown[] => instance.getVisibleRows()
  .filter((row) => row.rowType === 'group')
  .map((row) => row.key);

describe('Grouping data controller — expanding', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('with a data source', () => {
    it('reports every group expanded when autoExpandAll is on', async () => {
      const { instance } = await createGroupedGrid();
      await flushAsync();

      expect(groupRowKeys(instance)).toEqual([['A'], ['B']]);
      expect(instance.isRowExpanded(['A'])).toBe(true);
      expect(instance.isRowExpanded(['B'])).toBe(true);
    });

    it('reports every group collapsed when autoExpandAll is off', async () => {
      const { instance } = await createGroupedGrid(false);
      await flushAsync();

      expect(instance.isRowExpanded(['A'])).toBe(false);
      expect(instance.isRowExpanded(['B'])).toBe(false);
    });

    it('collapses one group through collapseRow', async () => {
      const { instance } = await createGroupedGrid();
      await flushAsync();

      const collapsing = instance.collapseRow(['A']);
      await flushAsync();
      await collapsing;

      expect(instance.isRowExpanded(['A'])).toBe(false);
      expect(instance.isRowExpanded(['B'])).toBe(true);
    });

    it('expands one group through expandRow', async () => {
      const { instance } = await createGroupedGrid(false);
      await flushAsync();

      const expanding = instance.expandRow(['A']);
      await flushAsync();
      await expanding;

      expect(instance.isRowExpanded(['A'])).toBe(true);
      expect(instance.isRowExpanded(['B'])).toBe(false);
    });

    it('collapses every group through collapseAll', async () => {
      const { instance } = await createGroupedGrid();
      await flushAsync();

      instance.collapseAll();
      await flushAsync();

      expect(instance.isRowExpanded(['A'])).toBe(false);
      expect(instance.isRowExpanded(['B'])).toBe(false);
    });

    it('expands every group through expandAll', async () => {
      const { instance } = await createGroupedGrid(false);
      await flushAsync();

      instance.expandAll();
      await flushAsync();

      expect(instance.isRowExpanded(['A'])).toBe(true);
      expect(instance.isRowExpanded(['B'])).toBe(true);
    });

    it('resets the page index when collapseAll changes the expanded state', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columns: [{ dataField: 'group', groupIndex: 0 }, 'value'],
        grouping: { autoExpandAll: true },
        paging: { pageSize: 2 },
      });
      await flushAsync();

      const paging = instance.pageIndex(1);
      await flushAsync();
      await paging;
      expect(instance.pageIndex()).toBe(1);

      instance.collapseAll();
      await flushAsync();

      expect(instance.pageIndex()).toBe(0);
    });
  });

  describe('with no data source', () => {
    it('reports a group as not expanded', async () => {
      const { instance } = await createDataGrid({
        columns: [{ dataField: 'group', groupIndex: 0 }, 'value'],
      });
      await flushAsync();

      expect(instance.isRowExpanded(['A'])).toBe(false);
    });

    it('resolves expandRow without reaching a data source', async () => {
      const { instance } = await createDataGrid({
        columns: [{ dataField: 'group', groupIndex: 0 }, 'value'],
      });
      await flushAsync();

      await instance.expandRow(['A']);

      expect(instance.getVisibleRows()).toEqual([]);
    });
  });
});
