import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { DataSource, type LoadOptions } from '@js/common/data';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
  toPlainFilter,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, name: 'Alex', age: 15 },
  { id: 2, name: 'Dan', age: 20 },
];

const GRID_OPTIONS: DataGridProperties = {
  dataSource: DATA,
  filterPanel: { visible: true },
  filterRow: { visible: true },
  columns: [
    { dataField: 'name', dataType: 'string' },
    { dataField: 'age', dataType: 'number' },
  ],
};

const createGrid = async (
  options: DataGridProperties = {},
): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({ ...GRID_OPTIONS, ...options });

  return instance;
};

const getNames = (instance: DataGridInstance): string[] => instance
  .getVisibleRows()
  .map((row) => (row.data as { name: string }).name);

const changeFilterRowValue = (columnIndex: number, value: string): void => {
  const input = document
    .querySelectorAll('.dx-datagrid-filter-row .dx-texteditor-input')
    .item(columnIndex) as HTMLInputElement;

  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

describe('Filter sync when a filter row value changes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when a value is entered', () => {
    it('should filter the data by the new value', async () => {
      const instance = await createGrid();

      changeFilterRowValue(0, 'Alex');
      await flushAsync();

      expect(getNames(instance)).toEqual(['Alex']);
    });

    it('should sync the value into filterValue', async () => {
      const instance = await createGrid();

      changeFilterRowValue(0, 'Alex');
      await flushAsync();

      expect(toPlainFilter(instance.option('filterValue'))).toEqual(['name', 'contains', 'Alex']);
    });

    it('should keep the filter of another column', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'name', dataType: 'string' },
          { dataField: 'age', dataType: 'number', filterValue: 20 },
        ],
      });

      changeFilterRowValue(0, 'Alex');
      await flushAsync();

      expect(getNames(instance)).toEqual([]);
      expect(toPlainFilter(instance.option('filterValue'))).toEqual([
        ['age', '=', 20], 'and', ['name', 'contains', 'Alex'],
      ]);
    });
  });

  describe('when a value is cleared', () => {
    it('should show all the rows again', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'name', dataType: 'string', filterValue: 'Alex' },
          { dataField: 'age', dataType: 'number' },
        ],
      });

      changeFilterRowValue(0, '');
      await flushAsync();

      expect(getNames(instance)).toEqual(['Alex', 'Dan']);
      expect(instance.option('filterValue')).toBeNull();
    });
  });

  describe('when the data source filters remotely', () => {
    it('should request the data once with the new filter', async () => {
      const load = jest.fn<(options: LoadOptions) => Promise<typeof DATA>>(
        () => Promise.resolve(DATA),
      );

      await createGrid({
        dataSource: new DataSource({ load, key: 'id' }),
        remoteOperations: { filtering: true },
      });

      load.mockClear();
      changeFilterRowValue(0, 'Alex');
      await flushAsync();

      expect(load).toHaveBeenCalledTimes(1);
      expect(toPlainFilter(load.mock.calls[0][0].filter)).toEqual(['name', 'contains', 'Alex']);
    });
  });

  describe('when filterValue is notified', () => {
    it('should report the combined filter of the new value', async () => {
      const filters: unknown[] = [];

      await createGrid({
        onOptionChanged: (e) => {
          if (e.fullName === 'filterValue') {
            filters.push(toPlainFilter(e.component.getCombinedFilter(true)));
          }
        },
      });

      changeFilterRowValue(0, 'Alex');
      await flushAsync();
      changeFilterRowValue(0, '');
      await flushAsync();

      expect(filters).toEqual([['name', 'contains', 'Alex'], undefined]);
    });

    it('should report the combined filter of a value set through the API', async () => {
      const filters: unknown[] = [];
      const instance = await createGrid({
        onOptionChanged: (e) => {
          if (e.fullName === 'filterValue') {
            filters.push(toPlainFilter(e.component.getCombinedFilter(true)));
          }
        },
      });

      instance.columnOption('age', 'filterValue', 20);
      await flushAsync();
      instance.columnOption('age', 'filterValue', null);
      await flushAsync();

      expect(filters).toEqual([['age', '=', 20], undefined]);
    });
  });
});
