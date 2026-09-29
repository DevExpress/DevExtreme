import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import type { DataController } from '../data_controller';
import type { DataChange } from '../types';

const createGrid = async (): Promise<DataController> => {
  const { instance } = await createDataGrid({
    dataSource: [{ id: 1, name: 'Alex' }, { id: 2, name: 'Dan' }],
    columns: ['name'],
  });

  return instance.getController('data') as unknown as DataController;
};

const refreshChange = (useProcessedItemsCache = false): DataChange => ({
  changeType: 'refresh',
  useProcessedItemsCache,
  cancelEmptyChanges: false,
});

describe('DataController updateItems', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should number the rows with their visible indices', async () => {
    const dataController = await createGrid();

    dataController.updateItems(refreshChange());

    expect(dataController.items().map((item) => item.rowIndex)).toEqual([0, 1]);
  });

  it('should reuse the processed rows when the change asks for the cache', async () => {
    const dataController = await createGrid();
    const [firstRow] = dataController.items();

    dataController.updateItems(refreshChange(true));

    expect(dataController.items()[0]).toBe(firstRow);
  });

  it('should process the rows again when the change does not ask for the cache', async () => {
    const dataController = await createGrid();
    const [firstRow] = dataController.items();

    dataController.updateItems(refreshChange());

    expect(dataController.items()[0]).not.toBe(firstRow);
    expect(dataController.items()[0].key).toBe(firstRow.key);
  });
});
