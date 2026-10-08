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
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

const DATA = [
  { id: 1, name: 'Alex', age: 15 },
  { id: 2, name: 'Dan', age: 20 },
];

const FILTER_VALUE = [['name', '=', 'Alex'], 'and', ['age', '=', 15]];

const createGrid = (options: DataGridProperties): Promise<{
  instance: DataGridInstance;
}> => createDataGrid({
  dataSource: DATA,
  columns: ['name', 'age'],
  filterPanel: { visible: true },
  ...options,
});

const getAdditionalFilter = (
  instance: DataGridInstance,
  excludedColumnDataField?: string,
): unknown => {
  const excludedColumn = excludedColumnDataField
    ? instance.columnOption(excludedColumnDataField) as Column
    : null;

  return toPlainFilter(instance.getController('filter').getAdditionalFilter(excludedColumn));
};

describe('Filter sync additional filter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when filter sync is active and a column is excluded', () => {
    it('should drop the conditions of that column', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: true,
        filterValue: FILTER_VALUE,
      });

      expect(getAdditionalFilter(instance, 'name')).toEqual(['age', '=', 15]);
    });
  });

  describe('when filter sync is not active', () => {
    it('should keep the conditions of the excluded column', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: false,
        filterValue: FILTER_VALUE,
      });

      expect(getAdditionalFilter(instance, 'name')).toEqual(FILTER_VALUE);
    });
  });

  describe('when no column is excluded', () => {
    it('should keep the whole filter value', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: true,
        filterValue: FILTER_VALUE,
      });

      expect(getAdditionalFilter(instance)).toEqual(FILTER_VALUE);
    });
  });

  describe('when there is no filter value', () => {
    it('should build no filter at all', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: true,
      });

      expect(getAdditionalFilter(instance, 'name')).toBeUndefined();
    });
  });
});
