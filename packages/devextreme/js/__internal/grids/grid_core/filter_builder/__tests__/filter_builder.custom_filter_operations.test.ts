import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { CustomOperation } from '@js/ui/filter_builder';
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

const CUSTOM_OPERATION: CustomOperation = {
  name: 'isEven',
  caption: 'Is even',
  dataTypes: ['number'],
  hasValue: false,
  calculateFilterExpression: () => [['age', '%', 2], '=', 0],
};

const createGrid = (
  customOperations?: CustomOperation[],
): Promise<{ instance: DataGridInstance }> => createDataGrid({
  dataSource: DATA,
  columns: ['name', 'age'],
  filterPanel: { visible: true },
  filterBuilder: customOperations ? { customOperations } : {},
});

const getOperationNames = (operations: CustomOperation[]): (string | undefined)[] => operations
  .map((operation) => operation.name);

describe('FilterBuilderController.getCustomFilterOperations', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when no custom operation is specified', () => {
    it('should return the built-in operations only', async () => {
      const { instance } = await createGrid();

      const operations = instance.getController('filterBuilder').getCustomFilterOperations();

      expect(getOperationNames(operations)).toEqual(['anyof', 'noneof']);
    });
  });

  describe('when filterBuilder.customOperations is specified', () => {
    it('should add them after the built-in operations', async () => {
      const { instance } = await createGrid([CUSTOM_OPERATION]);

      const operations = instance.getController('filterBuilder').getCustomFilterOperations();

      expect(getOperationNames(operations)).toEqual(['anyof', 'noneof', 'isEven']);
    });
  });

  describe('when the method is called on the component', () => {
    it('should be available as a public method', async () => {
      const { instance } = await createGrid([CUSTOM_OPERATION]);

      const operations = (instance as unknown as {
        getCustomFilterOperations: () => CustomOperation[];
      }).getCustomFilterOperations();

      expect(getOperationNames(operations)).toEqual(['anyof', 'noneof', 'isEven']);
    });
  });
});
