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

const updateFilter = (
  instance: DataGridInstance,
  filter: unknown,
  remoteFiltering: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => instance.getController('columns').updateFilter(filter, remoteFiltering);

describe('ColumnsController.updateFilter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when filtering locally', () => {
    it('should replace the data field with the column selector itself', async () => {
      const { instance } = await createGrid();
      const nameColumn = instance.getController('columns').getVisibleColumns()[0];

      const result = updateFilter(instance, ['name', '=', 'Alex'], false);

      expect(result[0]).toBe(nameColumn.selector);
    });

    it('should tag the column selector with its column index', async () => {
      const { instance } = await createGrid();
      const columns = instance.getController('columns').getVisibleColumns();

      updateFilter(instance, ['age', '=', 15], false);

      expect((columns[1].selector as TaggedSelector).columnIndex).toBe(columns[1].index);
    });

    it('should walk nested groups', async () => {
      const { instance } = await createGrid();
      const columns = instance.getController('columns').getVisibleColumns();

      const result = updateFilter(
        instance,
        [['name', '=', 'Alex'], 'and', ['age', '=', 15]],
        false,
      );

      expect(result[0][0]).toBe(columns[0].selector);
      expect(result[1]).toBe('and');
      expect(result[2][0]).toBe(columns[1].selector);
    });

    it('should leave an unknown field alone', async () => {
      const { instance } = await createGrid();

      expect(updateFilter(instance, ['unknown', '=', 1], false)).toEqual(['unknown', '=', 1]);
    });
  });

  describe('when filtering remotely', () => {
    it('should keep the data fields', async () => {
      const { instance } = await createGrid();

      expect(updateFilter(instance, ['name', '=', 'Alex'], true)).toEqual(['name', '=', 'Alex']);
    });
  });

  describe('when the filter array carries its own properties', () => {
    it('should carry them over to the result', async () => {
      const { instance } = await createGrid();
      const filter = extend([], [['name', '=', 'Alex'], 'and', ['age', '=', 15]]);

      filter.columnIndex = 7;
      filter.filterValue = 'ZZ';
      filter.selectedFilterOperation = 'between';

      const result = updateFilter(instance, filter, false);

      expect(result.columnIndex).toBe(7);
      expect(result.filterValue).toBe('ZZ');
      expect(result.selectedFilterOperation).toBe('between');
    });

    it('should pass columnIndex and filterValue down but not selectedFilterOperation', async () => {
      const { instance } = await createGrid();
      const customSelector = (): number => 1;
      const filter = extend([], [[customSelector, '=', 'Alex']]);

      filter.columnIndex = 3;
      filter.filterValue = 'inherited';
      filter.selectedFilterOperation = 'between';

      updateFilter(instance, filter, false);

      expect((customSelector as TaggedSelector).columnIndex).toBe(3);
      expect((customSelector as TaggedSelector).filterValue).toBe('inherited');
      expect((customSelector as TaggedSelector).selectedFilterOperation).toBeUndefined();
    });
  });
});
