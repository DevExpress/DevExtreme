import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { logger } from '@js/core/utils/console';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import { refreshRow } from '@ts/grids/grid_core/__tests__/__mock__/helpers/row_changes';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import { DataController } from '../data_controller';
import type {
  Cell, DataChange, ProcessedItem, UpdateChange,
} from '../types';

type CallLog = string[];

declare class ExposedDataController extends DataController {
  public _items: ProcessedItem[];

  public applyChangeUpdate: (change: UpdateChange) => void;

  public applyChangesOnly: (change: DataChange) => void;

  public getRowIndexDelta: () => number;

  public getChangedColumnIndices: (
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ) => number[] | undefined;
}

interface TestContext {
  dataController: ExposedDataController;
  log: CallLog;
}

const createGridWithCallLog = async (
  options: DataGridProperties = {},
): Promise<TestContext> => {
  const { instance } = await createDataGrid({
    dataSource: [],
    columns: ['name', 'age'],
    repaintChangesOnly: true,
    ...options,
  });

  return {
    dataController: instance.getController('data') as unknown as ExposedDataController,
    log: [],
  };
};

const createOldRow = (key: number, values: unknown[], log: CallLog): ProcessedItem => ({
  rowType: 'data',
  key,
  data: { id: key },
  values,
  cells: values.map((_value, columnIndex): Cell => ({
    column: { index: columnIndex },
    isEditing: false,
    update: (_row?: ProcessedItem, keepRow?: boolean): void => {
      log.push(`cell ${key}.${columnIndex} ${keepRow ? 'keepRow' : 'replaceRow'}`);
    },
  })),
  update: (): void => {
    log.push(`row ${key}`);
  },
});

const createNewRow = (key: number, values: unknown[]): ProcessedItem => ({
  rowType: 'data',
  key,
  data: { id: key },
  values,
});

const createRefreshChange = (items: ProcessedItem[]): DataChange => ({
  changeType: 'refresh',
  repaintChangesOnly: true,
  items,
});

const createUpdateChange = (items: ProcessedItem[]): UpdateChange => ({
  changeType: 'update',
  rowIndices: [0],
  items,
});

describe('DataController row changes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('applyChangesOnly', () => {
    it('should hand the new row to the updaters of every unchanged row', async () => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = [
        createOldRow(1, ['Alex', 15], log),
        createOldRow(2, ['Dan', 20], log),
      ];

      dataController.applyChangesOnly(createRefreshChange([
        createNewRow(1, ['Alex', 15]),
        createNewRow(2, ['Dan', 20]),
      ]));

      expect(log).toEqual([
        'row 1',
        'cell 1.0 keepRow',
        'cell 1.1 keepRow',
        'row 2',
        'cell 2.0 keepRow',
        'cell 2.1 keepRow',
      ]);
    });

    it('should report no changed rows when every row is unchanged', async () => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = [createOldRow(1, ['Alex', 15], log)];

      const change = createRefreshChange([createNewRow(1, ['Alex', 15])]);
      dataController.applyChangesOnly(change);

      const updateChange = change as UpdateChange;

      expect(updateChange.changeType).toBe('update');
      expect(updateChange.rowIndices).toEqual([]);
      expect(updateChange.changeTypes).toEqual([]);
      expect(updateChange.items).toEqual([]);
      expect(updateChange.isLiveUpdate).toBe(true);
    });

    it('should skip the unchanged-row hand-over for a row whose values changed', async () => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = [
        createOldRow(1, ['Alex', 15], log),
        createOldRow(2, ['Dan', 20], log),
      ];

      const change = createRefreshChange([
        createNewRow(1, ['Alex', 15]),
        createNewRow(2, ['Dan', 21]),
      ]);
      dataController.applyChangesOnly(change);

      expect(log).toEqual([
        'row 1',
        'cell 1.0 keepRow',
        'cell 1.1 keepRow',
        'cell 2.0 replaceRow',
        'row 2',
      ]);

      const updateChange = change as UpdateChange;

      expect(updateChange.rowIndices).toEqual([1]);
      expect(updateChange.changeTypes).toEqual(['update']);
      expect(updateChange.columnIndices).toEqual([[1]]);
    });

    it('should replace the row in the list before the updaters run', async () => {
      const { dataController, log } = await createGridWithCallLog();
      const oldRow = createOldRow(1, ['Alex', 15], log);
      const newRow = createNewRow(1, ['Alex', 16]);
      const rowsDuringUpdate: ProcessedItem[] = [];

      oldRow.update = (): void => {
        rowsDuringUpdate.push(dataController._items[0]);
      };
      dataController._items = [oldRow];

      dataController.applyChangesOnly(createRefreshChange([newRow]));

      expect(rowsDuringUpdate[0]).toBe(newRow);
    });

    it('should report the removed row itself', async () => {
      const { dataController, log } = await createGridWithCallLog();
      const removedRow = createOldRow(2, ['Dan', 20], log);

      dataController._items = [createOldRow(1, ['Alex', 15], log), removedRow];

      const change = createRefreshChange([createNewRow(1, ['Alex', 15])]);
      dataController.applyChangesOnly(change);

      const updateChange = change as UpdateChange;

      expect(updateChange.changeTypes).toEqual(['remove']);
      expect(updateChange.items).toEqual([removedRow]);
      expect(updateChange.items).toHaveLength(updateChange.rowIndices.length);
    });

    it('should hand over every unchanged row before applying any change', async () => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = [
        createOldRow(1, ['Alex', 15], log),
        createOldRow(2, ['Dan', 20], log),
      ];

      dataController.applyChangesOnly(createRefreshChange([
        createNewRow(1, ['Alexander', 15]),
        createNewRow(2, ['Dan', 20]),
      ]));

      expect(log).toEqual([
        'row 2',
        'cell 2.0 keepRow',
        'cell 2.1 keepRow',
        'cell 1.1 replaceRow',
        'row 1',
      ]);
    });

    it('should hand over the rows surrounding an insert', async () => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = [
        createOldRow(1, ['Alex', 15], log),
        createOldRow(2, ['Dan', 20], log),
      ];

      const change = createRefreshChange([
        createNewRow(1, ['Alex', 15]),
        createNewRow(3, ['Sam', 30]),
        createNewRow(2, ['Dan', 20]),
      ]);
      dataController.applyChangesOnly(change);

      expect(log).toEqual([
        'row 1',
        'cell 1.0 keepRow',
        'cell 1.1 keepRow',
        'row 2',
        'cell 2.0 keepRow',
        'cell 2.1 keepRow',
      ]);

      const updateChange = change as UpdateChange;

      expect(updateChange.changeTypes).toEqual(['insert']);
      expect(updateChange.rowIndices).toEqual([1]);
    });

    it('should hand over the rows surrounding a remove', async () => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = [
        createOldRow(1, ['Alex', 15], log),
        createOldRow(2, ['Dan', 20], log),
        createOldRow(3, ['Sam', 30], log),
      ];

      const change = createRefreshChange([
        createNewRow(1, ['Alex', 15]),
        createNewRow(3, ['Sam', 30]),
      ]);
      dataController.applyChangesOnly(change);

      expect(log).toEqual([
        'row 1',
        'cell 1.0 keepRow',
        'cell 1.1 keepRow',
        'row 3',
        'cell 3.0 keepRow',
        'cell 3.1 keepRow',
      ]);

      const updateChange = change as UpdateChange;

      expect(updateChange.changeTypes).toEqual(['remove']);
      expect(updateChange.rowIndices).toEqual([1]);
    });

    describe('when the rows are reordered', () => {
      const reorder = async (): Promise<TestContext & {
        change: DataChange;
        newRows: ProcessedItem[];
      }> => {
        const { dataController, log } = await createGridWithCallLog();

        dataController._items = [
          createOldRow(1, ['Alex', 15], log),
          createOldRow(2, ['Dan', 20], log),
          createOldRow(3, ['Sam', 30], log),
        ];

        const newRows = [
          createNewRow(1, ['Alex', 15]),
          createNewRow(3, ['Sam', 30]),
          createNewRow(2, ['Dan', 20]),
        ];
        const change = createRefreshChange(newRows);
        dataController.applyChangesOnly(change);

        return {
          dataController, log, change, newRows,
        };
      };

      it('should fall back to a full change', async () => {
        const { dataController, change, newRows } = await reorder();

        expect(change.changeType).toBe('refresh');
        expect((change as UpdateChange).rowIndices).toBeUndefined();
        expect(dataController._items).toEqual(newRows);
      });

      it('should not refresh the rows compared before reorder detected', async () => {
        const { log } = await reorder();

        expect(log).toEqual([]);
      });
    });

    describe('when a row updater throws', () => {
      it('should catch the throw and fall back to a full change', async () => {
        const { dataController, log } = await createGridWithCallLog();
        const loggedError = jest.spyOn(logger, 'error').mockImplementation(() => {});
        const throwingRow = createOldRow(2, ['Dan', 20], log);

        throwingRow.update = (): void => {
          throw new Error('row template failed');
        };

        dataController._items = [createOldRow(1, ['Alex', 15], log), throwingRow];

        const newRows = [createNewRow(1, ['Alex', 15]), createNewRow(2, ['Dan', 20])];
        const change = createRefreshChange(newRows);

        expect(() => dataController.applyChangesOnly(change)).not.toThrow();
        expect(change.changeType).toBe('refresh');
        expect(dataController._items).toEqual(newRows);
        expect(log).toEqual(['row 1', 'cell 1.0 keepRow', 'cell 1.1 keepRow']);
        expect(loggedError).toHaveBeenCalledTimes(1);

        loggedError.mockRestore();
      });
    });
  });

  describe('applyChangeUpdate', () => {
    const updateRow = async (
      options: DataGridProperties = {},
      change: Partial<UpdateChange> = {},
    ): Promise<TestContext & { change: UpdateChange }> => {
      const { dataController, log } = await createGridWithCallLog(options);

      dataController._items = [createOldRow(1, ['Alex', 15], log)];

      const updateChange = {
        ...createUpdateChange([createNewRow(1, ['Alex', 16])]),
        ...change,
      };
      dataController.applyChangeUpdate(updateChange);

      return { dataController, log, change: updateChange };
    };

    const applyUpdate = async (
      items: ProcessedItem[],
      newItems: ProcessedItem[],
      rowIndices: number[],
    ): Promise<TestContext & { change: UpdateChange }> => {
      const { dataController, log } = await createGridWithCallLog();

      dataController._items = items;

      const change: UpdateChange = { changeType: 'update', rowIndices, items: newItems };
      dataController.applyChangeUpdate(change);

      return { dataController, log, change };
    };

    const operations = (
      change: UpdateChange,
    ): [string, number][] => (change.changeTypes ?? [])
      .map((changeType, index) => [changeType, change.rowIndices[index]]);

    it('should repaint the changed cells only', async () => {
      const { change, log } = await updateRow();

      expect(change.rowIndices).toEqual([0]);
      expect(change.changeTypes).toEqual(['update']);
      expect(change.columnIndices).toEqual([[1]]);
      expect(log).toEqual(['cell 1.0 replaceRow', 'row 1']);
    });

    it('should replace the row in the list before the updaters run', async () => {
      const { dataController, log } = await createGridWithCallLog();
      const oldRow = createOldRow(1, ['Alex', 15], log);
      const newRow = createNewRow(1, ['Alex', 16]);
      const rowsDuringUpdate: ProcessedItem[] = [];

      oldRow.update = (): void => {
        rowsDuringUpdate.push(dataController._items[0]);
      };
      dataController._items = [oldRow];

      dataController.applyChangeUpdate(createUpdateChange([newRow]));

      expect(rowsDuringUpdate[0]).toBe(newRow);
    });

    it('should repaint the whole row when the changes are not tracked', async () => {
      const { change, log } = await updateRow({ repaintChangesOnly: false });

      expect(change.columnIndices).toEqual([undefined]);
      expect(log).toEqual([]);
    });

    it('should repaint the whole row on a full update', async () => {
      const { change, log } = await updateRow({}, { isFullUpdate: true });

      expect(change.columnIndices).toEqual([undefined]);
      expect(log).toEqual([]);
    });

    it('should repaint the whole row when a row template draws it', async () => {
      const { change } = await updateRow({ dataRowTemplate: (): void => {} });

      expect(change.columnIndices).toEqual([undefined]);
    });

    it('should replace the updated row in place', async () => {
      const newItems = [createNewRow(1, ['Alex', 16])];

      const { dataController, change } = await applyUpdate(
        [createNewRow(1, ['Alex', 15])],
        newItems,
        [0],
      );

      expect(dataController._items[0]).toBe(newItems[0]);
      expect(operations(change)).toEqual([['update', 0]]);
    });

    it('should insert the row that appeared', async () => {
      const keptRow = createNewRow(2, ['Dan', 20]);
      const newItems = [createNewRow(1, ['Alex', 15]), createNewRow(2, ['Dan', 20])];

      const { dataController, change } = await applyUpdate([keptRow], newItems, [0]);

      expect(dataController._items).toEqual([newItems[0], keptRow]);
      expect(operations(change)).toEqual([['insert', 0]]);
      expect(change.items?.[0]).toBe(newItems[0]);
    });

    it('should report the removed row itself', async () => {
      const removedRow = createNewRow(1, ['Alex', 15]);
      const keptRow = createNewRow(2, ['Dan', 20]);

      const { dataController, change } = await applyUpdate(
        [removedRow, keptRow],
        [createNewRow(2, ['Dan', 20])],
        [0],
      );

      expect(dataController._items).toEqual([keptRow]);
      expect(operations(change)).toEqual([['remove', 0]]);
      expect(change.items?.[0]).toBe(removedRow);
      expect(change.items).toHaveLength(change.rowIndices.length);
    });

    it('should report an update when another row takes the index', async () => {
      const newItems = [createNewRow(2, ['Dan', 20])];

      const { dataController, change } = await applyUpdate(
        [createNewRow(1, ['Alex', 15])],
        newItems,
        [0],
      );

      expect(dataController._items[0]).toBe(newItems[0]);
      expect(operations(change)).toEqual([['update', 0]]);
      expect(change.columnIndices).toEqual([undefined]);
    });

    it('should report nothing when the row is missing in both lists', async () => {
      const { dataController, change } = await applyUpdate([], [], [0]);

      expect(dataController._items).toEqual([]);
      expect(operations(change)).toEqual([]);
    });

    it('should shift the indices that follow an insert', async () => {
      const newItems = [
        createNewRow(3, ['Mike', 40]),
        createNewRow(1, ['Alex', 15]),
        createNewRow(2, ['Dan', 21]),
      ];

      const { dataController, change } = await applyUpdate(
        [createNewRow(1, ['Alex', 15]), createNewRow(2, ['Dan', 20])],
        newItems,
        [0, 1],
      );

      expect(dataController._items).toEqual(newItems);
      expect(operations(change)).toEqual([['insert', 0], ['update', 2]]);
    });

    it('should visit the index a remove freed once again', async () => {
      const newItems = [createNewRow(1, ['Alex', 15]), createNewRow(3, ['Bob', 31])];

      const { dataController, change } = await applyUpdate(
        [createNewRow(1, ['Alex', 15]), createNewRow(2, ['Dan', 20]), createNewRow(3, ['Bob', 30])],
        newItems,
        [1, 2],
      );

      expect(dataController._items[1]).toBe(newItems[1]);
      expect(operations(change)).toEqual([['remove', 1], ['update', 1]]);
    });

    it('should apply a duplicated index once', async () => {
      const { change } = await applyUpdate(
        [createNewRow(1, ['Alex', 15])],
        [createNewRow(1, ['Alex', 16])],
        [0, 0],
      );

      expect(operations(change)).toEqual([['update', 0]]);
    });

    it('should take the row by the absolute index and report the visible one', async () => {
      const { dataController } = await createGridWithCallLog();
      const invisibleRow = createNewRow(1, ['Alex', 15]);
      const newItems = [createNewRow(1, ['Alex', 15]), createNewRow(2, ['Dan', 21])];

      dataController.getRowIndexDelta = (): number => 1;
      dataController._items = [invisibleRow, createNewRow(2, ['Dan', 20])];

      const change: UpdateChange = { changeType: 'update', rowIndices: [0], items: newItems };
      dataController.applyChangeUpdate(change);

      expect(dataController._items[0]).toBe(invisibleRow);
      expect(dataController._items[1]).toBe(newItems[1]);
      expect(newItems[1].rowIndex).toBe(1);
      expect(operations(change)).toEqual([['update', 0]]);
    });

    it('should not report the update as a live one', async () => {
      const { dataController } = await createGridWithCallLog();
      const changedColumnIndices = jest.spyOn(dataController, 'getChangedColumnIndices');

      dataController._items = [createNewRow(1, ['Alex', 15])];
      dataController.applyChangeUpdate(createUpdateChange([createNewRow(1, ['Alex', 16])]));

      expect(changedColumnIndices).toHaveBeenCalledTimes(1);
      expect(changedColumnIndices.mock.calls[0][3]).toBeUndefined();
    });

    it('should report only the visibility when it changed', async () => {
      const { dataController } = await createGridWithCallLog();
      const changedColumnIndices = jest.spyOn(dataController, 'getChangedColumnIndices');
      const newItems = [{ ...createNewRow(1, ['Alex', 15]), visible: false }];

      dataController._items = [{ ...createNewRow(1, ['Alex', 15]), visible: true }];

      const change: UpdateChange = { changeType: 'update', rowIndices: [0], items: newItems };
      dataController.applyChangeUpdate(change);

      expect(dataController._items[0]).toBe(newItems[0]);
      expect(change.items).toEqual([{ visible: false }]);
      expect(change.columnIndices).toEqual([undefined]);
      expect(changedColumnIndices).not.toHaveBeenCalled();
    });
  });

  describe('isSameRowState', () => {
    const dataRow = (partial: Partial<ProcessedItem> = {}): ProcessedItem => ({
      rowType: 'data',
      key: 1,
      data: { id: 1 },
      values: ['Alex', 15],
      ...partial,
    });

    it('should not report a row when nothing changed', async () => {
      const change = await refreshRow(dataRow(), dataRow());

      expect(change.rowIndices).toEqual([]);
    });

    it('should report a row when a value changed', async () => {
      const change = await refreshRow(dataRow(), dataRow({ values: ['Alex', 16] }));

      expect(change.rowIndices).toEqual([0]);
      expect(change.changeTypes).toEqual(['update']);
    });
  });
});
