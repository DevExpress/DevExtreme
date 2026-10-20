import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { INSERT_INDEX } from '@ts/grids/grid_core/editing/const';
import type { EditingChange } from '@ts/grids/grid_core/editing/types';

interface EditingControllerInternals {
  _getInsertRowIndex: (
    items: (RawItemData | ProcessedItem)[],
    change: Partial<EditingChange>,
    isProcessedItems?: boolean,
  ) => number;
}

type GridInstance = Awaited<ReturnType<typeof createDataGrid>>['instance'];

const DATA = [{ id: 1 }, { id: 2 }, { id: 3 }];

const getInsertRowIndex = (
  instance: GridInstance,
  items: (RawItemData | ProcessedItem)[],
  change: Partial<EditingChange>,
  isProcessedItems?: boolean,
): number => {
  const editingController = instance.getController('editing') as unknown as EditingControllerInternals;

  return editingController._getInsertRowIndex(items, change, isProcessedItems);
};

const getRows = (instance: GridInstance): ProcessedItem[] => instance.getController('data').items();

interface RowShape {
  rowType: string;
  key: unknown;
}

const getRowShapes = (instance: GridInstance): RowShape[] => getRows(instance)
  .map(({ rowType, key }) => ({ rowType, key }));

describe('EditingController _getInsertRowIndex', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('without an anchor key', () => {
    it('should return 0 when there are no items', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(getInsertRowIndex(instance, [], {})).toBe(0);
    });

    it('should return -1 when there are items', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(getInsertRowIndex(instance, getRows(instance), {}, true)).toBe(-1);
    });
  });

  describe('processed rows without detail rows', () => {
    it('should return the anchor row index to insert before it', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(getInsertRowIndex(instance, getRows(instance), { insertBeforeKey: 2 }, true)).toBe(1);
    });

    it('should return the next row index to insert after the anchor row', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 2 }, true)).toBe(2);
    });

    it('should return the row count to insert after the last row', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 3 }, true)).toBe(3);
    });

    it('should return -1 when the anchor key is not found', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 99 }, true)).toBe(-1);
    });
  });

  describe('processed rows with an expanded master-detail row', () => {
    const createGridWithExpandedRow = async (key: number): Promise<GridInstance> => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        masterDetail: { enabled: true },
      });
      await flushAsync();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.expandRow(key);
      await flushAsync();

      return instance;
    };

    it('should place the detail row right after its master row with the same key', async () => {
      const instance = await createGridWithExpandedRow(1);

      expect(getRowShapes(instance)).toEqual([
        { rowType: 'data', key: 1 },
        { rowType: 'detail', key: 1 },
        { rowType: 'data', key: 2 },
        { rowType: 'data', key: 3 },
      ]);
    });

    it('should insert after the detail row of the anchor row', async () => {
      const instance = await createGridWithExpandedRow(1);

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 1 }, true)).toBe(2);
    });

    it('should insert before the master row, not between it and its detail row', async () => {
      const instance = await createGridWithExpandedRow(1);

      expect(getInsertRowIndex(instance, getRows(instance), { insertBeforeKey: 1 }, true)).toBe(0);
    });

    it('should not skip rows after an anchor row without a detail row', async () => {
      const instance = await createGridWithExpandedRow(1);

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 2 }, true)).toBe(3);
    });

    it('should return the row count to insert after the last row with its detail row', async () => {
      const instance = await createGridWithExpandedRow(3);

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 3 }, true)).toBe(4);
    });
  });

  describe('processed rows with expanded adaptive and master-detail rows', () => {
    const createGridWithBothDetailRows = async (): Promise<GridInstance> => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        masterDetail: { enabled: true },
      });
      await flushAsync();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.expandRow(1);
      await flushAsync();
      instance.expandAdaptiveDetailRow(1);
      await flushAsync();

      return instance;
    };

    it('should place both detail rows right after their master row with the same key', async () => {
      const instance = await createGridWithBothDetailRows();

      expect(getRowShapes(instance)).toEqual([
        { rowType: 'data', key: 1 },
        { rowType: 'detailAdaptive', key: 1 },
        { rowType: 'detail', key: 1 },
        { rowType: 'data', key: 2 },
        { rowType: 'data', key: 3 },
      ]);
    });

    it('should insert after both detail rows of the anchor row', async () => {
      const instance = await createGridWithBothDetailRows();

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 1 }, true)).toBe(3);
    });

    it('should insert before the master row', async () => {
      const instance = await createGridWithBothDetailRows();

      expect(getInsertRowIndex(instance, getRows(instance), { insertBeforeKey: 1 }, true)).toBe(0);
    });
  });

  describe('processed rows with a row edited in form mode', () => {
    const createGridWithEditedRow = async (
      editedKey: number,
      expandedKey?: number,
    ): Promise<GridInstance> => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        editing: { mode: 'form', allowUpdating: true },
        masterDetail: { enabled: expandedKey !== undefined },
      });
      await flushAsync();

      if (expandedKey !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        instance.expandRow(expandedKey);
        await flushAsync();
      }

      instance.editRow(instance.getRowIndexByKey(editedKey));
      await flushAsync();

      return instance;
    };

    it('should type the edited row as a detail row with its own key', async () => {
      const instance = await createGridWithEditedRow(2);

      expect(getRowShapes(instance)).toEqual([
        { rowType: 'data', key: 1 },
        { rowType: 'detail', key: 2 },
        { rowType: 'data', key: 3 },
      ]);
    });

    it('should return the anchor row index when the anchor row is followed by the edited row', async () => {
      const instance = await createGridWithEditedRow(2);

      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 1 }, true)).toBe(0);
    });

    it('should return the last anchor row index when its detail row is followed by the edited row', async () => {
      const instance = await createGridWithEditedRow(2, 1);

      expect(getRowShapes(instance)).toEqual([
        { rowType: 'data', key: 1 },
        { rowType: 'detail', key: 1 },
        { rowType: 'detail', key: 2 },
        { rowType: 'data', key: 3 },
      ]);
      expect(getInsertRowIndex(instance, getRows(instance), { insertAfterKey: 1 }, true)).toBe(1);
    });
  });

  describe('raw items', () => {
    it('should find the anchor item by the store key', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      const items = DATA.map((item) => ({ ...item }));

      expect(getInsertRowIndex(instance, items, { insertAfterKey: 2 })).toBe(2);
      expect(getInsertRowIndex(instance, items, { insertBeforeKey: 2 })).toBe(1);
    });

    it('should find a new item by its key field', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      const items = [{ id: 1 }, { key: 'new', [INSERT_INDEX]: 1 }, { id: 2 }];

      expect(getInsertRowIndex(instance, items, { insertAfterKey: 'new' })).toBe(2);
    });

    it('should skip an item that is not an object, even if it equals the key', async () => {
      // without a key expression, the store key of an item is the item itself
      const { instance } = await createDataGrid({ dataSource: DATA, keyExpr: undefined });
      await flushAsync();

      const items = [2, { key: 2, [INSERT_INDEX]: 1 }] as unknown as RawItemData[];

      expect(getInsertRowIndex(instance, items, { insertBeforeKey: 2 })).toBe(1);
    });

    it('should skip a null item before the anchor item', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      const items = [{ id: 1 }, null, { id: 2 }] as unknown as RawItemData[];

      expect(getInsertRowIndex(instance, items, { insertAfterKey: 2 })).toBe(3);
    });

    it.each(['detail', 'detailAdaptive'])('should not treat a data field rowType: %s as a detail row', async (rowType) => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();

      const items = [{ id: 1 }, { id: 2, rowType }, { id: 3 }];

      expect(getInsertRowIndex(instance, items, { insertAfterKey: 1 })).toBe(1);
    });

    it('should show a new row after an anchor followed by a data field named rowType', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }, { id: 2, rowType: 'detailAdaptive' }, { id: 3 }],
        editing: {
          mode: 'batch',
          changes: [{
            type: 'insert', key: 'new', insertAfterKey: 1, data: {},
          }],
        },
      });
      await flushAsync();

      expect(getRows(instance).map(({ key }) => key)).toEqual([1, 'new', 2, 3]);
    });
  });
});
