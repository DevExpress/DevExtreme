import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Dan' },
];

const GRID_OPTIONS: DataGridProperties = {
  dataSource: DATA,
  filterPanel: { visible: true },
  filterSyncEnabled: true,
  columns: ['name'],
};

const createGrid = async (): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid(GRID_OPTIONS);

  return instance;
};

describe('FilterSyncController.withColumnOptionsSync', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when a callback runs', () => {
    it('should not sync column options back into filterValue', async () => {
      const instance = await createGrid();

      instance.getController('filterSync').withColumnOptionsSync(() => {
        instance.columnOption('name', 'filterValue', 'Alex');
      });

      expect(instance.option('filterValue')).toBeNull();
    });

    it('should return the callback result', async () => {
      const instance = await createGrid();

      expect(instance.getController('filterSync').withColumnOptionsSync(() => 'result')).toBe('result');
    });

    it('should stop syncing afterwards', async () => {
      const instance = await createGrid();
      const filterSyncController = instance.getController('filterSync');

      filterSyncController.withColumnOptionsSync(() => undefined);

      expect(filterSyncController.isSyncingColumnOptions()).toBe(false);
    });
  });

  describe('when a nested call completes', () => {
    it('should keep syncing suppressed for the outer call', async () => {
      const instance = await createGrid();
      const filterSyncController = instance.getController('filterSync');

      filterSyncController.withColumnOptionsSync(() => {
        filterSyncController.withColumnOptionsSync(() => undefined);

        expect(filterSyncController.isSyncingColumnOptions()).toBe(true);

        instance.columnOption('name', 'filterValue', 'Alex');
      });

      expect(instance.option('filterValue')).toBeNull();
      expect(filterSyncController.isSyncingColumnOptions()).toBe(false);
    });
  });

  describe('when the callback throws', () => {
    it('should rethrow the error', async () => {
      const instance = await createGrid();

      expect(() => instance.getController('filterSync').withColumnOptionsSync(() => {
        throw new Error('sync failed');
      })).toThrow('sync failed');
    });

    it('should stop syncing', async () => {
      const instance = await createGrid();
      const filterSyncController = instance.getController('filterSync');

      expect(() => filterSyncController.withColumnOptionsSync(() => {
        throw new Error('sync failed');
      })).toThrow('sync failed');

      expect(filterSyncController.isSyncingColumnOptions()).toBe(false);
    });
  });
});
