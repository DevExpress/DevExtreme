import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { logger } from '@js/core/utils/console';
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

  public applyChangesOnly: (change: DataChange) => void;
}

interface TestContext {
  dataController: ExposedDataController;
  log: CallLog;
}

const createGridWithCallLog = async (): Promise<TestContext> => {
  const { instance } = await createDataGrid({
    dataSource: [],
    columns: ['name', 'age'],
    repaintChangesOnly: true,
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
        // only untouched cell is called, without `keepRow` - `_partialUpdateRow`, not the refresh.
        'cell 2.0 replaceRow',
        'row 2',
      ]);

      const updateChange = change as UpdateChange;

      expect(updateChange.rowIndices).toEqual([1]);
      expect(updateChange.changeTypes).toEqual(['update']);
      expect(updateChange.columnIndices).toEqual([[1]]);
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
