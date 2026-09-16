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
import type { FilterSourceContext } from '@ts/grids/grid_core/filter/types';

const DATA = [
  { id: 1, name: 'Alex', age: 15 },
  { id: 2, name: 'Dan', age: 20 },
];

const createGrid = (options: DataGridProperties): Promise<{
  instance: DataGridInstance;
}> => createDataGrid({
  dataSource: DATA,
  columns: ['name', 'age'],
  filterPanel: { visible: true },
  ...options,
});

const isFilterSourceActive = (instance: DataGridInstance): boolean => {
  const context: FilterSourceContext = {
    langParams: undefined,
    excludedColumn: null,
    filterSyncActive: true,
    columnSourcesActive: true,
    columnsController: instance.getController('columns'),
  };

  return instance.getController('filterSync').isFilterSourceActive(context);
};

describe('FilterSyncController.isFilterSourceActive', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the columns allow filtering', () => {
    it('should take part in the filter', async () => {
      const { instance } = await createGrid({});

      expect(isFilterSourceActive(instance)).toBe(true);
    });
  });

  describe('when no column allows filtering', () => {
    it('should not take part in the filter', async () => {
      const { instance } = await createGrid({
        columns: [
          { dataField: 'name', allowFiltering: false, allowHeaderFiltering: false },
          { dataField: 'age', allowFiltering: false, allowHeaderFiltering: false },
        ],
      });

      expect(isFilterSourceActive(instance)).toBe(false);
    });
  });

  describe('when filterPanel.filterEnabled is false', () => {
    it('should not take part in the filter', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true, filterEnabled: false },
      });

      expect(isFilterSourceActive(instance)).toBe(false);
    });
  });
});
