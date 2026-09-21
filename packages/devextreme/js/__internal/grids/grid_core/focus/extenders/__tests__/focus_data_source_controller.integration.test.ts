import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

describe('Focus data source controller', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe("when a push empties the grid and a pushed subscriber's own change cycle runs first", () => {
    it('still resets the focused row', async () => {
      const { instance } = await createDataGrid({
        dataSource: {
          store: {
            type: 'array',
            key: 'id',
            data: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' },
            ],
          },
          reshapeOnPush: true,
          pushAggregationTimeout: 0,
        },
        focusedRowEnabled: true,
        focusedRowKey: 1,
        selection: { mode: 'multiple' },
        selectedRowKeys: [1],
        columns: ['id', 'name'],
      });

      instance.getDataSource().store().push([
        { type: 'remove', key: 1 },
        { type: 'remove', key: 2 },
      ]);
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(0);
      expect(instance.getSelectedRowKeys()).toEqual([]);
      expect(instance.option('focusedRowKey')).toBeNull();
      expect(instance.option('focusedRowIndex')).toBe(-1);
    });
  });

  describe('when an unrelated change empties the grid after an earlier push was handled', () => {
    it('keeps the focused row, because one push forces exactly one update', async () => {
      const { instance } = await createDataGrid({
        dataSource: {
          store: {
            type: 'array',
            key: 'id',
            data: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' },
              { id: 3, name: 'Item 3' },
            ],
          },
          reshapeOnPush: true,
          pushAggregationTimeout: 0,
        },
        focusedRowEnabled: true,
        focusedRowKey: 2,
        columns: ['id', 'name'],
      });

      instance.getDataSource().store().push([
        { type: 'update', key: 3, data: { id: 3, name: 'Item 3 renamed' } },
      ]);
      await flushAsync();

      instance.filter(['name', '=', 'nothing matches']);
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(0);
      expect(instance.option('focusedRowKey')).toBe(2);
    });
  });
});
