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

const getFilterExpressions = (
  instance: DataGridInstance,
  contextOptions: Partial<FilterSourceContext> = {},
): unknown => {
  const context: FilterSourceContext = {
    langParams: undefined,
    excludedColumn: null,
    filterSyncActive: true,
    columnSourcesActive: true,
    columnsController: instance.getController('columns'),
    ...contextOptions,
  };

  return toPlainFilter(instance.getController('filterBuilder').getFilterExpressions(context));
};

describe('FilterBuilderController.getFilterExpressions', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the filter value is set', () => {
    it('should build a single expression from it', async () => {
      const { instance } = await createGrid({
        filterValue: [['name', '=', 'Alex'], 'and', ['age', '=', 15]],
      });

      expect(getFilterExpressions(instance)).toEqual([[
        ['name', '=', 'Alex'],
        'and',
        ['age', '=', 15],
      ]]);
    });
  });

  describe('when there is no filter value', () => {
    it('should build no expression at all', async () => {
      const { instance } = await createGrid({});

      expect(getFilterExpressions(instance)).toEqual([]);
    });
  });

  describe('when a custom operation is used', () => {
    it('should build the expression through that operation', async () => {
      const { instance } = await createGrid({
        filterValue: ['name', 'anyof', ['Alex', 'Dan']],
      });

      expect(getFilterExpressions(instance)).toEqual([[
        ['name', '=', 'Alex'],
        'or',
        ['name', '=', 'Dan'],
      ]]);
    });
  });

  describe('when a column is excluded and filter sync is active', () => {
    it('should drop the conditions of that column', async () => {
      const { instance } = await createGrid({
        filterValue: [['name', '=', 'Alex'], 'and', ['age', '=', 15]],
      });

      expect(getFilterExpressions(instance, {
        excludedColumn: instance.columnOption('name') as Column,
      })).toEqual([['age', '=', 15]]);
    });
  });

  describe('when a column is excluded and filter sync is not active', () => {
    it('should keep the conditions of that column', async () => {
      const { instance } = await createGrid({
        filterValue: [['name', '=', 'Alex'], 'and', ['age', '=', 15]],
      });

      expect(getFilterExpressions(instance, {
        excludedColumn: instance.columnOption('name') as Column,
        filterSyncActive: false,
      })).toEqual([[
        ['name', '=', 'Alex'],
        'and',
        ['age', '=', 15],
      ]]);
    });
  });
});
