import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  toPlainFilter,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, name: 'Alex', age: 15 },
  { id: 2, name: 'Dan', age: 20 },
];

const SAVED_STATE_WITHOUT_IDENTIFIER = {
  columns: [
    { visibleIndex: 0, dataField: 'name', filterValue: 'Alex' },
    { visibleIndex: 1, filterValue: 42, allowFiltering: false },
  ],
};

const createGrid = (options: DataGridProperties): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGridInstance;
}> => createDataGrid({ dataSource: DATA, ...options });

describe('Filter sync filterValue', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when a condition has only two elements', () => {
    it('should filter the data as if the operation were =', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true },
        filterSyncEnabled: true,
        filterValue: ['name', 'Alex'],
        columns: ['name', 'age'],
      });

      const names = instance.getVisibleRows().map((row) => (row.data as { name: string }).name);

      expect(toPlainFilter(instance.getCombinedFilter(true))).toEqual(['name', '=', 'Alex']);
      expect(names).toEqual(['Alex']);
    });

    it('should fill both the filter row and the header filter of the column', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true },
        filterSyncEnabled: true,
        filterValue: ['name', 'Alex'],
        columns: ['name', 'age'],
      });

      expect(instance.columnOption('name', 'filterValue')).toBe('Alex');
      expect(instance.columnOption('name', 'filterValues')).toEqual(['Alex']);
    });
  });

  describe('when a saved column has no identifier', () => {
    it('should throw while restoring the state', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true },
        columns: ['name', 'age'],
        stateStoring: { enabled: true, type: 'custom', customLoad: () => Promise.resolve({}) },
      });

      expect(() => instance.state(SAVED_STATE_WITHOUT_IDENTIFIER)).toThrow(TypeError);
    });

    it('should leave behind a filterValue whose field is undefined', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true },
        columns: ['name', 'age'],
        stateStoring: { enabled: true, type: 'custom', customLoad: () => Promise.resolve({}) },
      });

      expect(() => instance.state(SAVED_STATE_WITHOUT_IDENTIFIER)).toThrow(TypeError);
      expect(instance.option('filterValue')).toEqual([
        ['name', 'contains', 'Alex'], 'and', [undefined, 'contains', 42],
      ]);
    });
  });
});
