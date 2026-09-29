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
  columns: [{ dataField: 'name', dataType: 'string' }],
};

const createGrid = async (
  options: DataGridProperties = {},
): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({ ...GRID_OPTIONS, ...options });

  return instance;
};

describe('FilterSyncController.syncColumnOption', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when a filter row option changes', () => {
    it('should sync the filter value into filterValue', async () => {
      const instance = await createGrid();

      instance.columnOption('name', 'filterValue', 'Alex');

      expect(toPlainFilter(instance.option('filterValue'))).toEqual(['name', 'contains', 'Alex']);
    });

    it('should sync the selected filter operation into filterValue', async () => {
      const instance = await createGrid({
        columns: [{ dataField: 'name', dataType: 'string', filterValue: 'Alex' }],
      });

      instance.columnOption('name', 'selectedFilterOperation', '=');

      expect(toPlainFilter(instance.option('filterValue'))).toEqual(['name', '=', 'Alex']);
    });
  });

  describe('when a header filter option changes', () => {
    it('should sync the filter values into filterValue', async () => {
      const instance = await createGrid();

      instance.columnOption('name', 'filterValues', ['Alex', 'Dan']);

      expect(toPlainFilter(instance.option('filterValue'))).toEqual(['name', 'anyof', ['Alex', 'Dan']]);
    });

    it('should sync a switch to the exclude filter type into filterValue', async () => {
      const instance = await createGrid({
        columns: [{ dataField: 'name', dataType: 'string', filterValues: ['Alex', 'Dan'] }],
      });

      instance.columnOption('name', 'filterType', 'exclude');

      expect(toPlainFilter(instance.option('filterValue'))).toEqual(['name', 'noneof', ['Alex', 'Dan']]);
    });
  });

  describe('when a column option unrelated to filtering changes', () => {
    it('should keep filterValue', async () => {
      const instance = await createGrid();

      instance.columnOption('name', 'caption', 'Name');

      expect(instance.option('filterValue')).toBeNull();
    });
  });

  describe('when filter sync is not active', () => {
    it('should keep filterValue', async () => {
      const instance = await createGrid({ filterSyncEnabled: false });

      instance.columnOption('name', 'filterValue', 'Alex');

      expect(instance.option('filterValue')).toBeNull();
    });
  });
});
