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
import type { VirtualItemsCount } from '@ts/grids/grid_core/virtual_data_loader/types';

interface VirtualScrollingDataController {
  viewportSize: (size?: number) => number;
  virtualItemsCount: () => VirtualItemsCount | undefined;
  loadViewport: () => void;
}

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

  describe('virtual items count after the viewport size changes (T1336247)', () => {
    const allRowsOnOnePage: Properties = {
      dataSource: DATA.slice(0, 12),
      paging: { pageSize: 20 },
    };

    const getDataController = (
      instance: Awaited<ReturnType<typeof createDataGrid>>['instance'],
    ): VirtualScrollingDataController => instance
      .getController('data') as unknown as VirtualScrollingDataController;

    it('describes the rendered rows when the viewport shrinks without re-rendering', async () => {
      const { instance } = await createVirtualGrid('virtual', allRowsOnOnePage);
      const dataController = getDataController(instance);

      dataController.viewportSize(4);

      expect(instance.getVisibleRows()).toHaveLength(12);
      expect(dataController.virtualItemsCount()).toEqual({ begin: 0, end: 0 });
    });

    it('keeps the bottom virtual items for the rows that are not rendered', async () => {
      const { instance } = await createVirtualGrid();
      const dataController = getDataController(instance);
      const renderedRowCount = instance.getVisibleRows().length;

      dataController.viewportSize(4);

      expect(dataController.virtualItemsCount()).toEqual({
        begin: 0,
        end: DATA.length - renderedRowCount,
      });
    });

    it('describes the rendered rows of a non-first page when only rows are rendered virtually', async () => {
      const { instance } = await createVirtualGrid('standard', {
        paging: { pageSize: 20 },
        scrolling: { mode: 'standard', rowRenderingMode: 'virtual' },
      });
      const dataController = getDataController(instance);

      const paging = instance.pageIndex(1);
      await flushAsync();
      await paging;

      const renderedRowCount = instance.getVisibleRows().length;

      expect(instance.getVisibleRows()[0].key).toBe(21);
      expect(dataController.virtualItemsCount()).toEqual({ begin: 0, end: 20 - renderedRowCount });
    });

    it('follows the viewport after the rows are re-rendered', async () => {
      const { instance } = await createVirtualGrid('virtual', allRowsOnOnePage);
      const dataController = getDataController(instance);

      dataController.viewportSize(4);
      dataController.loadViewport();
      await flushAsync();

      const renderedRowCount = instance.getVisibleRows().length;

      expect(renderedRowCount).toBeLessThan(12);
      expect(dataController.virtualItemsCount()).toEqual({ begin: 0, end: 12 - renderedRowCount });
    });

    it('describes the rendered rows after a row is selected while the viewport is shrunk', async () => {
      const { instance } = await createVirtualGrid('virtual', {
        ...allRowsOnOnePage,
        selection: { mode: 'single' },
      });
      const dataController = getDataController(instance);

      dataController.viewportSize(4);
      const selecting = instance.selectRows([1], false);
      await flushAsync();
      await selecting;

      expect(instance.isRowSelected(1)).toBe(true);
      expect(instance.getVisibleRows()).toHaveLength(12);
      expect(dataController.virtualItemsCount()).toEqual({ begin: 0, end: 0 });
    });

    it('describes the rendered rows after the focused row changes while the viewport is shrunk', async () => {
      const { instance } = await createVirtualGrid('virtual', {
        ...allRowsOnOnePage,
        focusedRowEnabled: true,
      });
      const dataController = getDataController(instance);

      dataController.viewportSize(4);
      instance.option('focusedRowKey', 1);
      await flushAsync();

      expect(instance.option('focusedRowIndex')).toBe(0);
      expect(instance.getVisibleRows()).toHaveLength(12);
      expect(dataController.virtualItemsCount()).toEqual({ begin: 0, end: 0 });
    });
  });
});
