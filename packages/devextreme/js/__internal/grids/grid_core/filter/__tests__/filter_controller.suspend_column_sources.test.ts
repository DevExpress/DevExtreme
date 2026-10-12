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
  toPlainFilter,
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

// A column filter is only visible to the column sources while `filterValue` stays empty,
// and the sync keeps those two in step. Setting the filter with the sync suppressed is
// the one way to reach that state.
const createGridWithFilterRowValue = async (): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid(GRID_OPTIONS);

  instance.getController('filterSync').withColumnOptionsSync(() => {
    instance.columnOption('name', 'filterValue', 'Alex');
  });

  return instance;
};

describe('FilterController.suspendColumnSources', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when a callback runs', () => {
    it('should skip the column sources and resume them afterwards', async () => {
      const instance = await createGridWithFilterRowValue();
      const filterController = instance.getController('filter');

      filterController.suspendColumnSources(() => {
        expect(filterController.getAdditionalFilter()).toBeUndefined();
      });

      expect(toPlainFilter(filterController.getAdditionalFilter())).toEqual(['name', 'contains', 'Alex']);
    });

    it('should return the callback result', async () => {
      const instance = await createGridWithFilterRowValue();
      const filterController = instance.getController('filter');

      expect(filterController.suspendColumnSources(() => 'result')).toBe('result');
    });
  });

  describe('when a nested call completes', () => {
    it('should keep the column sources suspended for the outer call', async () => {
      const instance = await createGridWithFilterRowValue();
      const filterController = instance.getController('filter');

      filterController.suspendColumnSources(() => {
        filterController.suspendColumnSources(() => undefined);

        expect(filterController.getAdditionalFilter()).toBeUndefined();
      });

      expect(toPlainFilter(filterController.getAdditionalFilter())).toEqual(['name', 'contains', 'Alex']);
    });
  });

  describe('when the callback throws', () => {
    it('should rethrow the error', async () => {
      const instance = await createGridWithFilterRowValue();
      const filterController = instance.getController('filter');

      expect(() => filterController.suspendColumnSources(() => {
        throw new Error('callback failed');
      })).toThrow('callback failed');
    });

    it('should resume the column sources', async () => {
      const instance = await createGridWithFilterRowValue();
      const filterController = instance.getController('filter');

      expect(() => filterController.suspendColumnSources(() => {
        throw new Error('callback failed');
      })).toThrow('callback failed');

      expect(toPlainFilter(filterController.getAdditionalFilter())).toEqual(['name', 'contains', 'Alex']);
    });
  });
});
