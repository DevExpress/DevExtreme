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
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

type ColumnWithSelector = Column & { selector?: unknown };

const DATA = [
  {
    id: 1, name: 'Alex', age: 15, city: 'Berlin',
  },
  {
    id: 2, name: 'Dan', age: 20, city: 'Munich',
  },
];

const COLUMNS_WITH_ROW_AND_HEADER_FILTERS: DataGridProperties['columns'] = [
  { dataField: 'name', filterValue: 'Alex' },
  { dataField: 'age', filterValues: [15] },
  'city',
];

const createGrid = (options: DataGridProperties): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGridInstance;
}> => createDataGrid({ dataSource: DATA, ...options });

const getDataFieldFilter = (
  instance: DataGridInstance,
): unknown => toPlainFilter(instance.getCombinedFilter(true));

const getVisibleColumns = (instance: DataGridInstance): ColumnWithSelector[] => instance
  .getController('columns')
  .getVisibleColumns() as ColumnWithSelector[];

const getFilterWithoutColumn = (
  instance: DataGridInstance,
  column: Column,
): unknown => toPlainFilter(
  instance.getController('data').getCombinedFilterWithExcludedColumn(column, true),
);

describe('DataController combined filter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when only the filter row has values', () => {
    it('should take the value of a single column', async () => {
      const { instance } = await createGrid({
        columns: [{ dataField: 'name', filterValue: 'Alex' }, 'age'],
      });

      expect(getDataFieldFilter(instance)).toEqual(['name', 'contains', 'Alex']);
    });

    it('should combine the values of several columns flatly', async () => {
      const { instance } = await createGrid({
        columns: [
          { dataField: 'name', filterValue: 'Alex' },
          { dataField: 'age', filterValue: 15 },
        ],
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['name', 'contains', 'Alex'], 'and', ['age', '=', 15],
      ]);
    });
  });

  describe('when only the header filter has values', () => {
    it('should take a single value', async () => {
      const { instance } = await createGrid({
        columns: [{ dataField: 'age', filterValues: [15] }, 'name'],
      });

      expect(getDataFieldFilter(instance)).toEqual(['age', '=', 15]);
    });

    it('should combine several values with or', async () => {
      const { instance } = await createGrid({
        columns: [{ dataField: 'age', filterValues: [15, 20] }, 'name'],
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['age', '=', 15], 'or', ['age', '=', 20],
      ]);
    });

    it('should negate the group for the exclude filter type', async () => {
      const { instance } = await createGrid({
        columns: [{ dataField: 'age', filterValues: [15], filterType: 'exclude' }, 'name'],
      });

      expect(getDataFieldFilter(instance)).toEqual(['!', ['age', '=', 15]]);
    });
  });

  describe('when only the search panel has text', () => {
    it('should match every searchable column with or', async () => {
      const { instance } = await createGrid({
        searchPanel: { text: 'Al' },
        columns: ['name', 'city'],
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['name', 'contains', 'Al'], 'or', ['city', 'contains', 'Al'],
      ]);
    });

    it('should skip hidden columns while searchVisibleColumnsOnly is on', async () => {
      const { instance } = await createGrid({
        searchPanel: { text: 'Al', searchVisibleColumnsOnly: true },
        columns: [{ dataField: 'name', visible: false }, 'city'],
      });

      expect(getDataFieldFilter(instance)).toEqual(['city', 'contains', 'Al']);
    });
  });

  describe('when only the filterValue option is set', () => {
    it('should take the option as is', async () => {
      const { instance } = await createGrid({
        filterValue: ['city', '=', 'Berlin'],
        columns: ['name', 'age', 'city'],
      });

      expect(getDataFieldFilter(instance)).toEqual(['city', '=', 'Berlin']);
    });
  });

  describe('when no source contributes', () => {
    it('should produce no filter', async () => {
      const { instance } = await createGrid({ columns: ['name', 'age'] });

      expect(getDataFieldFilter(instance)).toBeUndefined();
    });
  });

  describe('when all four sources contribute', () => {
    // The chain nests to the left: every layer passes the result of `super` as the first
    // element of its own array. A flat combination carries the same meaning but a different
    // structure, and the QUnit suites compare structures whole.
    it('should nest them left to right in the source order', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: false,
        filterValue: ['city', '=', 'Berlin'],
        searchPanel: { text: 'Al' },
        columns: [
          { dataField: 'name', filterValue: 'A', selectedFilterOperation: 'contains' },
          { dataField: 'age', filterValues: [15, 20] },
          'city',
        ],
      });

      const filterRow = ['name', 'contains', 'A'];
      const headerFilter = [['age', '=', 15], 'or', ['age', '=', 20]];
      const search = [['name', 'contains', 'Al'], 'or', ['city', 'contains', 'Al']];
      const filterValue = ['city', '=', 'Berlin'];

      expect(getDataFieldFilter(instance)).toEqual([
        [[filterRow, 'and', headerFilter], 'and', search], 'and', filterValue,
      ]);
    });

    it('should keep the source order when the middle sources are empty', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: false,
        filterValue: ['city', '=', 'Berlin'],
        columns: [{ dataField: 'name', filterValue: 'Alex' }, 'age', 'city'],
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['name', 'contains', 'Alex'], 'and', ['city', '=', 'Berlin'],
      ]);
    });
  });

  describe('when filter sync is off', () => {
    it('should keep the column filters next to filterValue', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: false,
        filterValue: ['city', '=', 'Berlin'],
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      expect(getDataFieldFilter(instance)).toEqual([
        [['name', 'contains', 'Alex'], 'and', ['age', '=', 15]], 'and', ['city', '=', 'Berlin'],
      ]);
    });
  });

  describe('when filter sync is on', () => {
    it('should drop the column filters while filterValue is set', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: true,
        filterValue: ['city', '=', 'Berlin'],
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      expect(getDataFieldFilter(instance)).toEqual(['city', '=', 'Berlin']);
    });

    it('should keep the column filters while filterValue is not set', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: true,
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['name', 'contains', 'Alex'], 'and', ['age', '=', 15],
      ]);
    });
  });

  describe('when filterSyncEnabled is auto', () => {
    it('should keep the column filters while the filter panel is hidden', async () => {
      const { instance } = await createGrid({
        filterValue: ['city', '=', 'Berlin'],
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      expect(getDataFieldFilter(instance)).toEqual([
        [['name', 'contains', 'Alex'], 'and', ['age', '=', 15]], 'and', ['city', '=', 'Berlin'],
      ]);
    });

    it('should drop the column filters while the filter panel is visible', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true },
        filterValue: ['city', '=', 'Berlin'],
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      expect(getDataFieldFilter(instance)).toEqual(['city', '=', 'Berlin']);
    });
  });

  describe('when filterPanel.filterEnabled is false', () => {
    it('should drop filterValue and keep the column filters', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: false,
        filterPanel: { visible: true, filterEnabled: false },
        filterValue: ['city', '=', 'Berlin'],
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['name', 'contains', 'Alex'], 'and', ['age', '=', 15],
      ]);
    });
  });

  describe('when no column allows filtering', () => {
    it('should skip filterValue', async () => {
      const { instance } = await createGrid({
        filterSyncEnabled: false,
        filterValue: ['name', '=', 'Alex'],
        columns: [
          { dataField: 'name', allowFiltering: false, allowHeaderFiltering: false },
          { dataField: 'age', allowFiltering: false, allowHeaderFiltering: false },
        ],
      });

      expect(instance.getController('columns').getFilteringColumns()).toHaveLength(0);
      expect(getDataFieldFilter(instance)).toBeUndefined();
    });
  });

  describe('when a column is excluded', () => {
    it('should drop its filter row condition', async () => {
      const { instance } = await createGrid({
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      const filter = getFilterWithoutColumn(instance, getVisibleColumns(instance)[0]);

      expect(filter).toEqual(['age', '=', 15]);
    });

    it('should drop its header filter condition', async () => {
      const { instance } = await createGrid({
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      const filter = getFilterWithoutColumn(instance, getVisibleColumns(instance)[1]);

      expect(filter).toEqual(['name', 'contains', 'Alex']);
    });

    it('should change nothing when the column has no conditions', async () => {
      const { instance } = await createGrid({
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      const filter = getFilterWithoutColumn(instance, getVisibleColumns(instance)[2]);

      expect(filter).toEqual([
        ['name', 'contains', 'Alex'], 'and', ['age', '=', 15],
      ]);
    });

    it('should drop its filterValue conditions while filter sync is on', async () => {
      const { instance } = await createGrid({
        filterPanel: { visible: true },
        filterSyncEnabled: true,
        filterValue: [['city', '=', 'Berlin'], 'and', ['name', '=', 'Alex']],
        columns: ['name', 'age', 'city'],
      });
      const columns = getVisibleColumns(instance);

      expect(getFilterWithoutColumn(instance, columns[2])).toEqual(['name', '=', 'Alex']);
      expect(getFilterWithoutColumn(instance, columns[0])).toEqual(['city', '=', 'Berlin']);
    });

    it('should not remember the excluded column after the call', async () => {
      const { instance } = await createGrid({
        columns: COLUMNS_WITH_ROW_AND_HEADER_FILTERS,
      });

      getFilterWithoutColumn(instance, getVisibleColumns(instance)[0]);

      expect(getDataFieldFilter(instance)).toEqual([
        ['name', 'contains', 'Alex'], 'and', ['age', '=', 15],
      ]);
    });
  });

  describe('when returnDataField is off', () => {
    it('should return the column selector instead of the data field', async () => {
      const { instance } = await createGrid({
        columns: [{ dataField: 'name', filterValue: 'Alex' }, 'age'],
      });

      const filter = instance.getCombinedFilter() as unknown as unknown[];

      expect(typeof filter[0]).toBe('function');
      expect(filter[0]).toBe(getVisibleColumns(instance)[0].selector);
    });
  });

  describe('when the search text fits no column', () => {
    it('should produce a match-nothing filter on its own', async () => {
      const { instance } = await createGrid({
        searchPanel: { text: 'Al' },
        columns: [{ dataField: 'age', dataType: 'number' }],
      });

      expect(getDataFieldFilter(instance)).toEqual(['!']);
    });

    it('should collapse the other sources too', async () => {
      const { instance } = await createGrid({
        searchPanel: { text: 'Al' },
        columns: [{ dataField: 'age', dataType: 'number', filterValue: 15 }],
      });

      expect(getDataFieldFilter(instance)).toEqual(['!']);
    });
  });
});
