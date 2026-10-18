import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';

const DATA = [
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
  { id: 3, value: 'c' },
];

type Instance = Awaited<ReturnType<typeof createDataGrid>>['instance'];

const dataControllerOf = (instance: Instance): DataController => instance.getController('data');

describe('DataController — loading state', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('with a data source', () => {
    it('reports loaded after the first load', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(dataControllerOf(instance).isLoaded()).toBe(true);
      expect(dataControllerOf(instance).isLoading()).toBe(false);
      expect(instance.getVisibleRows()).toHaveLength(DATA.length);
    });

    it('reloads the rows', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      const reloading = dataControllerOf(instance).reload(true);
      await flushAsync();
      await reloading;

      expect(instance.getVisibleRows()).toHaveLength(DATA.length);
      expect(dataControllerOf(instance).isLoaded()).toBe(true);
    });

    it('loads all items regardless of paging', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA, paging: { pageSize: 2 } });
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(2);

      let allItems: unknown[] = [];
      dataControllerOf(instance).loadAllItems().done((items: unknown[]) => { allItems = items; });
      await flushAsync();

      expect(allItems).toHaveLength(DATA.length);
    });

    it('is not custom loading until beginCustomLoading is called', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(dataControllerOf(instance).isCustomLoading()).toBe(false);

      instance.beginCustomLoading('working');

      expect(dataControllerOf(instance).isCustomLoading()).toBe(true);

      instance.endCustomLoading();
      await flushAsync();

      expect(dataControllerOf(instance).isCustomLoading()).toBe(false);
    });

    // The adapter keeps the last operation's flags, so a completed load still reports one.
    it('reports the load operation that produced the current rows', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(dataControllerOf(instance).hasLoadOperation()).toBe(true);
    });

    it('pushes sorting down to the data source when a column changes', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columns: [{ dataField: 'id' }, { dataField: 'value' }],
      });
      await flushAsync();

      instance.columnOption('value', 'sortOrder', 'desc');
      await flushAsync();

      expect(instance.getVisibleRows().map((row) => row.key)).toEqual([3, 2, 1]);
    });
  });

  describe('with no data source', () => {
    it('reports loaded', async () => {
      const { instance } = await createDataGrid({});
      await flushAsync();

      expect(dataControllerOf(instance).isLoaded()).toBe(true);
      expect(dataControllerOf(instance).hasLoadOperation()).toBe(false);
      expect(dataControllerOf(instance).isCustomLoading()).toBe(false);
    });

    it('resolves loadAllItems with nothing', async () => {
      const { instance } = await createDataGrid({});
      await flushAsync();

      const resolved: unknown[][] = [];
      dataControllerOf(instance).loadAllItems()
        .done((items: unknown[]) => { resolved.push(items); });
      await flushAsync();

      expect(resolved[0]).toEqual([]);
    });
  });
});
