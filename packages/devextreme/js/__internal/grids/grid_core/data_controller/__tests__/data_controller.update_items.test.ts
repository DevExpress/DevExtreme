import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import { DataController } from '../data_controller';
import type { Cell, DataChange, ProcessedItem } from '../types';

declare class ExposedDataController extends DataController {
  public _items: ProcessedItem[];

  public _updateItemsCore: (change: DataChange) => void;
}

const createGrid = async (): Promise<ExposedDataController> => {
  const { instance } = await createDataGrid({
    dataSource: [{ id: 1, name: 'Alex' }, { id: 2, name: 'Dan' }],
    columns: ['name'],
  });

  return instance.getController('data') as unknown as ExposedDataController;
};

const refreshChange = (useProcessedItemsCache = false): DataChange => ({
  changeType: 'refresh',
  useProcessedItemsCache,
  cancelEmptyChanges: false,
});

describe('DataController updateItems', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('_updateItemsCore', () => {
    it('should carry the rendered cells over to the rows a full change brought', async () => {
      const dataController = await createGrid();
      const cells: Cell[] = [{ column: { index: 0 } }];

      dataController._items[0].cells = cells;

      dataController._updateItemsCore(refreshChange());

      expect(dataController._items[0].cells).toBe(cells);
    });

    it('should number the rows with their visible indices', async () => {
      const dataController = await createGrid();

      dataController._updateItemsCore(refreshChange());

      expect(dataController._items.map((item) => item.rowIndex)).toEqual([0, 1]);
    });

    it('should reuse the processed rows when the change asks for the cache', async () => {
      const dataController = await createGrid();
      const [firstRow] = dataController._items;

      dataController._updateItemsCore(refreshChange(true));

      expect(dataController._items[0]).toBe(firstRow);
    });

    it('should process the rows again when the change does not ask for the cache', async () => {
      const dataController = await createGrid();
      const [firstRow] = dataController._items;

      dataController._updateItemsCore(refreshChange());

      expect(dataController._items[0]).not.toBe(firstRow);
      expect(dataController._items[0].key).toBe(firstRow.key);
    });
  });
});
