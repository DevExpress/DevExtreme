import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { DataGridScrollMode, Properties } from '@js/ui/data_grid';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = Array.from({ length: 40 }, (_, i) => ({ id: i + 1, value: `row ${i + 1}` }));

const createVirtualGrid = async (
  mode: DataGridScrollMode = 'virtual',
  options: Properties = {},
): ReturnType<typeof createDataGrid> => {
  const grid = await createDataGrid({
    dataSource: DATA,
    height: 200,
    paging: { pageSize: 10 },
    scrolling: { mode },
    ...options,
  });
  await flushAsync();
  return grid;
};

describe('Virtual scrolling data controller — viewport reads', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('virtual mode', () => {
    it('starts at the first page with no row index offset', async () => {
      const { instance } = await createVirtualGrid();

      expect(instance.pageIndex()).toBe(0);
      expect(instance.getController('data').getRowIndexOffset()).toBe(0);
      expect(instance.totalCount()).toBe(DATA.length);
    });

    it('reports the loaded page count through the adapter', async () => {
      const { instance } = await createVirtualGrid();
      const adapter = instance.getController('dataSource').getAdapter();

      expect(adapter?.pageIndex()).toBe(0);
      expect(instance.pageCount()).toBe(4);
    });

    it('accepts a page change', async () => {
      const { instance } = await createVirtualGrid();

      const paging = instance.pageIndex(2);
      await flushAsync();
      await paging;

      expect(instance.pageIndex()).toBe(2);
    });

    it('still renders rows after a page change', async () => {
      const { instance } = await createVirtualGrid();

      const paging = instance.pageIndex(1);
      await flushAsync();
      await paging;

      expect(instance.getVisibleRows().length).toBeGreaterThan(0);
      expect(instance.totalCount()).toBe(DATA.length);
    });
  });

  describe('infinite mode', () => {
    // Infinite mode counts only what it has loaded, so the total tracks the page size.
    it('loads the first page only', async () => {
      const { instance } = await createVirtualGrid('infinite');

      expect(instance.pageIndex()).toBe(0);
      expect(instance.totalCount()).toBe(10);
      expect(instance.getVisibleRows().length).toBeGreaterThan(0);
    });

    it('refreshes without losing the data source', async () => {
      const { instance } = await createVirtualGrid('infinite');

      const refreshing = instance.refresh();
      await flushAsync();
      await refreshing;

      expect(instance.totalCount()).toBe(10);
      expect(instance.getVisibleRows().length).toBeGreaterThan(0);
    });
  });

  describe('standard mode is unaffected', () => {
    it('pages normally', async () => {
      const { instance } = await createVirtualGrid('standard');

      const paging = instance.pageIndex(3);
      await flushAsync();
      await paging;

      expect(instance.pageIndex()).toBe(3);
      expect(instance.getVisibleRows().map((row) => row.key)[0]).toBe(31);
    });
  });
});
