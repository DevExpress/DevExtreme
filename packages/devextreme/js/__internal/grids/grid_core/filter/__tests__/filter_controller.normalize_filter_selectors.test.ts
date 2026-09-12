import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { ColumnSelector } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';

const DATA = [
  { id: 1, name: 'Alex', age: 15 },
  { id: 2, name: 'Dan', age: 20 },
];

interface TaggedSelector {
  columnIndex?: number;
  filterValue?: unknown;
  selectedFilterOperation?: unknown;
}

const createGrid = (): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGridInstance;
}> => createDataGrid({
  dataSource: DATA,
  columns: ['name', 'age'],
});

const normalizeFilterSelectors = (
  instance: DataGridInstance,
  filter: unknown,
  remoteFiltering: boolean,
): unknown => instance
  .getController('filter')
  .normalizeFilterSelectors(filter as DataFilter, remoteFiltering);

describe('FilterController.normalizeFilterSelectors', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when filtering locally', () => {
    it('should replace the data field with the column selector itself', async () => {
      const { instance } = await createGrid();
      const nameColumn = instance.getController('columns').getVisibleColumns()[0];

      const result = normalizeFilterSelectors(instance, ['name', '=', 'Alex'], false) as unknown[];

      expect(result[0]).toBe(nameColumn.selector);
    });

    it('should tag the column selector with its column index', async () => {
      const { instance } = await createGrid();
      const columns = instance.getController('columns').getVisibleColumns();

      normalizeFilterSelectors(instance, ['age', '=', 15], false);

      expect(columns[1].selector?.columnIndex).toBe(columns[1].index);
    });

    it('should walk nested groups', async () => {
      const { instance } = await createGrid();
      const columns = instance.getController('columns').getVisibleColumns();

      const result = normalizeFilterSelectors(
        instance,
        [['name', '=', 'Alex'], 'and', ['age', '=', 15]],
        false,
      ) as unknown[];

      expect((result[0] as unknown[])[0]).toBe(columns[0].selector);
      expect(result[1]).toBe('and');
      expect((result[2] as unknown[])[0]).toBe(columns[1].selector);
    });

    it('should leave an unknown field alone', async () => {
      const { instance } = await createGrid();

      expect(normalizeFilterSelectors(instance, ['unknown', '=', 1], false)).toEqual(['unknown', '=', 1]);
    });
  });

  describe('when filtering remotely', () => {
    it('should keep the data fields', async () => {
      const { instance } = await createGrid();

      expect(normalizeFilterSelectors(instance, ['name', '=', 'Alex'], true)).toEqual(['name', '=', 'Alex']);
    });
  });

  describe('when the filter array carries its own properties', () => {
    it('should carry them over to the result', async () => {
      const { instance } = await createGrid();
      const filter = extend([], [['name', '=', 'Alex'], 'and', ['age', '=', 15]]);

      filter.columnIndex = 7;
      filter.filterValue = 'ZZ';
      filter.selectedFilterOperation = 'between';

      const result = normalizeFilterSelectors(instance, filter, false) as TaggedSelector;

      expect(result.columnIndex).toBe(7);
      expect(result.filterValue).toBe('ZZ');
      expect(result.selectedFilterOperation).toBe('between');
    });

    it('should pass columnIndex and filterValue down but not selectedFilterOperation', async () => {
      const { instance } = await createGrid();
      const customSelector: ColumnSelector = (): number => 1;
      const filter = extend([], [[customSelector, '=', 'Alex']]);

      filter.columnIndex = 3;
      filter.filterValue = 'inherited';
      filter.selectedFilterOperation = 'between';

      normalizeFilterSelectors(instance, filter, false);

      expect(customSelector.columnIndex).toBe(3);
      expect(customSelector.filterValue).toBe('inherited');
      expect(customSelector.selectedFilterOperation).toBeUndefined();
    });
  });
});
