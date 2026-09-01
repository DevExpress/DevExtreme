import {
  describe, expect, it, jest,
} from '@jest/globals';

import type {
  DataChange, GetUpdatedColumnIndices, ItemChange, ProcessedItem,
  RowOperationOptions, RowWatch, UpdateChange, UpdateRowChange,
} from '../../types';
import {
  applyRowOperations,
  attachChangedRows,
  canDiffColumns,
  convertToUpdateChange,
  getChangedRowIndices,
  getDataRowIndex,
  getGroupColumnIndices,
  getRowKey,
  getRowOperation,
  indexRowsByKey,
  isSameGroupRowState,
  isSameItem,
  partialUpdateRow,
  resolveRepaintChangesOnly,
  syncRowsAfterChange,
  updateKeptRows,
  updateRowCells,
} from '../row_changes';

const row = (partial: Partial<ProcessedItem>): ProcessedItem => ({
  rowType: 'data',
  data: {},
  values: [],
  ...partial,
} as ProcessedItem);

const trackedRow = (key: number): ProcessedItem => row({
  key,
  update: jest.fn(),
  cells: [{ update: jest.fn() }],
});

const updateOf = (item: ProcessedItem): jest.Mock => item.update as jest.Mock;

describe('isSameItem', () => {
  it('should return false when one of the rows is missing', () => {
    const item = row({ key: 1 });

    expect(isSameItem(undefined, item)).toBe(false);
    expect(isSameItem(item, undefined)).toBe(false);
    expect(isSameItem(undefined, undefined)).toBe(false);
  });

  it('should compare keys', () => {
    expect(isSameItem(row({ key: 1 }), row({ key: 1 }))).toBe(true);
    expect(isSameItem(row({ key: 1 }), row({ key: 2 }))).toBe(false);
  });

  it('should compare composite keys by value', () => {
    const key = { id: 1, room: 2 };

    expect(isSameItem(row({ key }), row({ key: { ...key } }))).toBe(true);
    expect(isSameItem(row({ key }), row({ key: { ...key, room: 3 } }))).toBe(false);
  });

  it('should ignore the row type unless strict', () => {
    const oldItem = row({ key: 1, rowType: 'data' });
    const newItem = row({ key: 1, rowType: 'detail' });

    expect(isSameItem(oldItem, newItem)).toBe(true);
    expect(isSameItem(oldItem, newItem, true)).toBe(false);
  });

  it('should allow the same row type when strict', () => {
    expect(isSameItem(
      row({ key: 1, rowType: 'group' }),
      row({ key: 1, rowType: 'group' }),
      true,
    )).toBe(true);
  });

  it('should compare the editing state of detail rows when strict', () => {
    const detail = row({ key: 1, rowType: 'detail', isEditing: false });

    expect(isSameItem(detail, row({ key: 1, rowType: 'detail', isEditing: false }), true))
      .toBe(true);
    expect(isSameItem(detail, row({ key: 1, rowType: 'detail', isEditing: true }), true))
      .toBe(false);
  });

  it('should not compare the editing state of non-detail rows', () => {
    expect(isSameItem(
      row({ key: 1, rowType: 'data', isEditing: false }),
      row({ key: 1, rowType: 'data', isEditing: true }),
      true,
    )).toBe(true);
  });
});

describe('isSameGroupRowState', () => {
  const groupRow = (partial: Partial<ProcessedItem>): ProcessedItem => row({
    rowType: 'group',
    isExpanded: true,
    data: { isContinuation: false, isContinuationOnNextPage: false },
    ...partial,
  });

  it('should return true for the same state', () => {
    expect(isSameGroupRowState(groupRow({}), groupRow({}))).toBe(true);
  });

  it('should compare the expanded state', () => {
    expect(isSameGroupRowState(groupRow({}), groupRow({ isExpanded: false }))).toBe(false);
  });

  it('should compare the continuation flags', () => {
    expect(isSameGroupRowState(
      groupRow({}),
      groupRow({ data: { isContinuation: true, isContinuationOnNextPage: false } }),
    )).toBe(false);

    expect(isSameGroupRowState(
      groupRow({}),
      groupRow({ data: { isContinuation: false, isContinuationOnNextPage: true } }),
    )).toBe(false);
  });

  it('should not compare the data beyond the continuation flags', () => {
    expect(isSameGroupRowState(
      groupRow({ data: { key: 1, isContinuation: false, isContinuationOnNextPage: false } }),
      groupRow({ data: { key: 2, isContinuation: false, isContinuationOnNextPage: false } }),
    )).toBe(true);
  });
});

describe('canDiffColumns', () => {
  it('should allow the diff for the rows of the same type', () => {
    expect(canDiffColumns(row({ rowType: 'data' }), row({ rowType: 'data' }))).toBe(true);
  });

  it('should forbid the diff for the rows of different types', () => {
    expect(canDiffColumns(row({ rowType: 'data' }), row({ rowType: 'detail' }))).toBe(false);
  });

  it('should forbid the diff for group footers', () => {
    expect(canDiffColumns(row({ rowType: 'groupFooter' }), row({ rowType: 'groupFooter' })))
      .toBe(false);
  });
});

describe('getGroupColumnIndices', () => {
  const groupRow = (partial: Partial<ProcessedItem>): ProcessedItem => row({
    rowType: 'group',
    isExpanded: true,
    data: { isContinuation: false, isContinuationOnNextPage: false },
    ...partial,
  });

  it('should skip the group expand cell', () => {
    const oldItem = groupRow({
      cells: [{ column: { type: 'groupExpand' } }, {}, { column: { dataField: 'name' } }],
    });

    expect(getGroupColumnIndices(oldItem, groupRow({}))).toEqual([1, 2]);
  });

  it('should return undefined when the old row has no cells', () => {
    expect(getGroupColumnIndices(groupRow({}), groupRow({}))).toBeUndefined();
  });

  it('should return undefined when the group state has changed', () => {
    const oldItem = groupRow({ cells: [{}] });

    expect(getGroupColumnIndices(oldItem, groupRow({ isExpanded: false }))).toBeUndefined();
  });
});

describe('getRowKey', () => {
  it('should tell apart the rows of different types with the same key', () => {
    expect(getRowKey(row({ key: 1, rowType: 'data' })))
      .not.toBe(getRowKey(row({ key: 1, rowType: 'detail' })));
  });

  it('should return the same key for equal composite keys', () => {
    expect(getRowKey(row({ key: { id: 1, room: 2 } })))
      .toBe(getRowKey(row({ key: { id: 1, room: 2 } })));
  });
});

describe('indexRowsByKey', () => {
  it('should number the rows and map their keys to the indices', () => {
    const items = [row({ key: 1 }), row({ key: 2 })];

    const indexByKey = indexRowsByKey(items);

    expect(items.map((item) => item.rowIndex)).toEqual([0, 1]);
    expect(indexByKey[getRowKey(items[0])]).toBe(0);
    expect(indexByKey[getRowKey(items[1])]).toBe(1);
  });

  it('should return undefined for an unknown key', () => {
    const indexByKey = indexRowsByKey([row({ key: 1 })]);

    expect(indexByKey[getRowKey(row({ key: 2 }))]).toBeUndefined();
  });
});

describe('updateRowCells', () => {
  it('should pass the new row to the row and cell updaters', () => {
    const newItem = row({ key: 1 });
    const update = jest.fn();
    const cellUpdate = jest.fn();
    const oldItem = row({ key: 1, update, cells: [{ update: cellUpdate }, {}] });

    updateRowCells(oldItem, newItem);

    expect(update).toHaveBeenCalledWith(newItem);
    expect(cellUpdate).toHaveBeenCalledWith(newItem, true);
  });

  it('should do nothing when the row has no cells', () => {
    const update = jest.fn();

    updateRowCells(row({ key: 1, update }), row({ key: 1 }));

    expect(update).not.toHaveBeenCalled();
  });
});

describe('updateKeptRows', () => {
  const refreshRows = (
    oldItems: ProcessedItem[],
    newItems: ProcessedItem[],
    itemChanges: ItemChange[],
  ): void => {
    updateKeptRows(oldItems, newItems, indexRowsByKey(newItems), itemChanges);
  };

  it('should pass the new row to a row that has no changes', () => {
    const oldItem = trackedRow(1);
    const newItem = row({ key: 1 });

    refreshRows([oldItem], [newItem], []);

    expect(updateOf(oldItem)).toHaveBeenCalledWith(newItem);
  });

  it('should skip a row reported as updated', () => {
    const oldItem = trackedRow(1);
    const newItem = row({ key: 1 });

    refreshRows([oldItem], [newItem], [{
      type: 'update', index: 0, data: newItem, oldItem,
    }]);

    expect(updateOf(oldItem)).not.toHaveBeenCalled();
  });

  it('should skip a row that is gone from the new list', () => {
    const oldItem = trackedRow(1);

    refreshRows([oldItem], [], [{ type: 'remove', index: 0, oldItem }]);

    expect(updateOf(oldItem)).not.toHaveBeenCalled();
  });

  it('should skip a reordered row', () => {
    const [stayed, ...moved] = [trackedRow(1), trackedRow(2), trackedRow(3)];
    const newRows = [row({ key: 1 }), row({ key: 3 }), row({ key: 2 })];

    // [1, 2, 3] -> [1, 3, 2]: rows 2 and 3 each is reported as a remove plus an insert
    refreshRows([stayed, ...moved], newRows, [
      { type: 'remove', index: 2, oldItem: moved[1] },
      { type: 'remove', index: 1, oldItem: moved[0] },
      { type: 'insert', index: 1, data: newRows[1] },
      { type: 'insert', index: 2, data: newRows[2] },
    ]);

    expect(updateOf(stayed)).toHaveBeenCalledWith(newRows[0]);
    expect(updateOf(moved[0])).not.toHaveBeenCalled();
    expect(updateOf(moved[1])).not.toHaveBeenCalled();
  });

  it('should ignore an inserted row, which has no old counterpart', () => {
    const oldItem = trackedRow(1);
    const inserted = row({ key: 2 });
    const newItem = row({ key: 1 });

    refreshRows([oldItem], [inserted, newItem], [{
      type: 'insert', index: 0, data: inserted,
    }]);

    expect(updateOf(oldItem)).toHaveBeenCalledWith(newItem);
  });

  it('should refresh the rows in old-list order', () => {
    const order: number[] = [];
    const track = (key: number): ProcessedItem => row({
      key,
      update: jest.fn(() => { order.push(key); }),
      cells: [{ update: jest.fn() }],
    });
    const oldItems = [track(1), track(2), track(3)];

    refreshRows(oldItems, [row({ key: 1 }), row({ key: 2 }), row({ key: 3 })], []);

    expect(order).toEqual([1, 2, 3]);
  });
});

describe('getDataRowIndex', () => {
  const rows = [
    row({ rowType: 'data' }),
    row({ rowType: 'group' }),
    row({ rowType: 'detail' }),
    row({ rowType: 'data' }),
  ];

  it('should count the data and group rows before the visible index', () => {
    expect(getDataRowIndex(rows, 0)).toBe(0);
    expect(getDataRowIndex(rows, 3)).toBe(2);
    expect(getDataRowIndex(rows, rows.length)).toBe(3);
  });

  it('should count the rows that are there when the index is out of range', () => {
    expect(getDataRowIndex(rows, 10)).toBe(3);
  });
});

describe('getChangedRowIndices', () => {
  it('should sort the indices ascending', () => {
    expect(getChangedRowIndices([4, 0, 2], 0)).toEqual([0, 2, 4]);
  });

  it('should not modify the source array', () => {
    const rowIndices = [4, 0, 2];

    getChangedRowIndices(rowIndices, 0);

    expect(rowIndices).toEqual([4, 0, 2]);
  });

  it('should drop negative indices', () => {
    expect(getChangedRowIndices([-2, 1, -1, 3], 0)).toEqual([1, 3]);
  });

  it('should keep the indices the delta makes non-negative when invisible ones are allowed', () => {
    expect(getChangedRowIndices([-2, -1, 1], 2, true)).toEqual([-2, -1, 1]);
    expect(getChangedRowIndices([-3, -1, 1], 2, true)).toEqual([-1, 1]);
  });

  it('should ignore the delta when invisible indices are not allowed', () => {
    expect(getChangedRowIndices([-1, 1], 2)).toEqual([1]);
  });
});

describe('getRowOperation', () => {
  it('should return undefined when the row is missing in both lists', () => {
    expect(getRowOperation([], [], 0)).toBeUndefined();
  });

  it('should detect an update of the same row', () => {
    const oldItems = [row({ key: 1 })];
    const newItems = [row({ key: 1 })];

    expect(getRowOperation(oldItems, newItems, 0)).toBe('update');
  });

  it('should detect an insert when there is no old row', () => {
    expect(getRowOperation([], [row({ key: 1 })], 0)).toBe('insert');
  });

  it('should detect an insert when the old row moved down', () => {
    const oldItems = [row({ key: 2 })];
    const newItems = [row({ key: 1 }), row({ key: 2 })];

    expect(getRowOperation(oldItems, newItems, 0)).toBe('insert');
  });

  it('should detect a remove when there is no new row', () => {
    expect(getRowOperation([row({ key: 1 })], [], 0)).toBe('remove');
  });

  it('should detect a remove when the new row moved up', () => {
    const oldItems = [row({ key: 1 }), row({ key: 2 })];
    const newItems = [row({ key: 2 })];

    expect(getRowOperation(oldItems, newItems, 0)).toBe('remove');
  });

  it('should detect a replace when a different row takes the index', () => {
    const oldItems = [row({ key: 1 })];
    const newItems = [row({ key: 2 })];

    expect(getRowOperation(oldItems, newItems, 0)).toBe('replace');
  });

  it('should compare the row type when neighbours share the key', () => {
    const oldItems = [row({ key: 1, rowType: 'data' }), row({ key: 1, rowType: 'detail' })];
    const newItems = [row({ key: 1, rowType: 'detail' }), row({ key: 1, rowType: 'data' })];

    expect(getRowOperation(oldItems, newItems, 0)).not.toBe('update');
  });
});

describe('attachChangedRows', () => {
  it('should split the changed rows into a list per field', () => {
    const change = {
      changeType: 'update',
      rowIndices: [1, 2],
      items: [row({ key: 1 })],
    } as UpdateChange;
    const item = row({ key: 2 });

    attachChangedRows(change, [{
      changeType: 'update',
      rowIndex: 3,
      item,
      columnIndices: [0, 2],
    }]);

    expect(change.items).toEqual([item]);
    expect(change.rowIndices).toEqual([3]);
    expect(change.changeTypes).toEqual(['update']);
    expect(change.columnIndices).toEqual([[0, 2]]);
  });

  it('should skip the item when the row is gone from the new list', () => {
    const change = { changeType: 'update' } as UpdateChange;

    attachChangedRows(change, [{ changeType: 'remove', rowIndex: 5 }]);

    expect(change.items).toEqual([]);
    expect(change.rowIndices).toEqual([5]);
    expect(change.changeTypes).toEqual(['remove']);
    expect(change.columnIndices).toEqual([undefined]);
  });
});

describe('convertToUpdateChange', () => {
  const refreshChange = (): DataChange => ({ changeType: 'refresh', items: [row({ key: 1 })] });

  it('should turn the refresh change into a partial update carrying no rows', () => {
    const change = refreshChange();

    convertToUpdateChange(change, []);

    expect(change).toEqual({
      changeType: 'update',
      repaintChangesOnly: true,
      items: [],
      rowIndices: [],
      changeTypes: [],
      columnIndices: [],
    });
  });

  it('should split the changed rows into a list per field', () => {
    const change = refreshChange();
    const firstItem = row({ key: 1 });
    const secondItem = row({ key: 2 });

    convertToUpdateChange(change, [
      {
        changeType: 'update', rowIndex: 0, item: firstItem, columnIndices: [0, 2],
      },
      { changeType: 'insert', rowIndex: 1, item: secondItem },
    ]);

    expect(change).toEqual({
      changeType: 'update',
      repaintChangesOnly: true,
      items: [firstItem, secondItem],
      rowIndices: [0, 1],
      changeTypes: ['update', 'insert'],
      columnIndices: [[0, 2], undefined],
    });
  });
});

describe('partialUpdateRow', () => {
  const partialUpdate = (
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    columnIndices: number[] | undefined,
    isLiveUpdate?: boolean,
  ): UpdateRowChange => partialUpdateRow(0, {
    oldItem,
    newItem,
    rowIndexDelta: 0,
    isLiveUpdate,
    getUpdatedColumnIndices: () => columnIndices,
  });

  it('should ask for the changed columns by the visible row index', () => {
    const oldItem = row({ key: 1 });
    const newItem = row({ key: 1 });
    const getUpdatedColumnIndices = jest.fn<GetUpdatedColumnIndices>(() => [1]);

    const changedRow = partialUpdateRow(5, {
      oldItem,
      newItem,
      rowIndexDelta: 2,
      isLiveUpdate: true,
      getUpdatedColumnIndices,
    });

    expect(getUpdatedColumnIndices.mock.calls).toEqual([[oldItem, newItem, 3, true]]);
    expect(changedRow).toEqual({
      changeType: 'update',
      rowIndex: 3,
      item: newItem,
      columnIndices: [1],
    });
  });

  it('should pass the new row to the updaters of the cells the change did not touch', () => {
    const newItem = row({ key: 1 });
    const cellUpdates = [jest.fn(), jest.fn(), jest.fn()];
    const oldItem = row({ key: 1, cells: cellUpdates.map((update) => ({ update })) });

    partialUpdate(oldItem, newItem, [1]);

    expect(cellUpdates[0]).toHaveBeenCalledWith(newItem);
    expect(cellUpdates[1]).not.toHaveBeenCalled();
    expect(cellUpdates[2]).toHaveBeenCalledWith(newItem);
  });

  it('should update every cell when no column has changed', () => {
    const newItem = row({ key: 1 });
    const cellUpdate = jest.fn();

    partialUpdate(row({ key: 1, cells: [{ update: cellUpdate }] }), newItem, []);

    expect(cellUpdate).toHaveBeenCalledWith(newItem);
  });

  it('should move the updaters and the cells to the new row', () => {
    const update = jest.fn();
    const watch: RowWatch = () => () => {};
    const cells = [{}];
    const newItem = row({ key: 1 });
    const oldItem = row({
      key: 1, update, watch, cells,
    });

    partialUpdate(oldItem, newItem, [0]);

    expect(newItem.update).toBe(update);
    expect(newItem.watch).toBe(watch);
    expect(newItem.cells).toBe(cells);
    expect(update).toHaveBeenCalledWith(newItem);
  });

  it('should keep the old values only on a live update', () => {
    const values = [1, 2];
    const liveItem = row({ key: 1 });
    const item = row({ key: 1 });

    partialUpdate(row({ key: 1, values }), liveItem, [0], true);
    partialUpdate(row({ key: 1, values }), item, [0]);

    expect(liveItem.oldValues).toBe(values);
    expect(item.oldValues).toBeUndefined();
  });

  it('should do nothing when the whole row is repainted', () => {
    const update = jest.fn();
    const cellUpdate = jest.fn();
    const oldItem = row({ key: 1, update, cells: [{ update: cellUpdate }] });
    const newItem = row({ key: 1 });

    const changedRow = partialUpdate(oldItem, newItem, undefined, true);

    expect(changedRow.columnIndices).toBeUndefined();
    expect(update).not.toHaveBeenCalled();
    expect(cellUpdate).not.toHaveBeenCalled();
    expect(newItem.update).toBeUndefined();
    expect(newItem.cells).toBeUndefined();
    expect(newItem.oldValues).toBeUndefined();
  });

  it('should repaint the whole row when no one asks for the changed columns', () => {
    const update = jest.fn();
    const oldItem = row({ key: 1, update, cells: [{ update: jest.fn() }] });
    const newItem = row({ key: 1 });

    const changedRow = partialUpdateRow(0, { oldItem, newItem, rowIndexDelta: 0 });

    expect(changedRow.columnIndices).toBeUndefined();
    expect(update).not.toHaveBeenCalled();
    expect(newItem.cells).toBeUndefined();
  });
});

describe('applyRowOperations', () => {
  const applyRowChanges = (
    items: ProcessedItem[],
    newItems: ProcessedItem[],
    rowIndices: number[],
    options: Partial<RowOperationOptions> = {},
  ): UpdateRowChange[] => applyRowOperations(rowIndices, {
    items,
    newItems,
    rowIndexDelta: 0,
    ...options,
  });

  const operations = (
    changedRows: UpdateRowChange[],
  ): [UpdateRowChange['changeType'], number][] => changedRows
    .map(({ changeType, rowIndex }) => [changeType, rowIndex]);

  it('should replace the updated row in place', () => {
    const items = [row({ key: 1 })];
    const newItems = [row({ key: 1, values: ['Alex'] })];

    const changedRows = applyRowChanges(items, newItems, [0]);

    expect(items[0]).toBe(newItems[0]);
    expect(changedRows).toEqual([{ changeType: 'update', rowIndex: 0, item: newItems[0] }]);
  });

  it('should insert the row that appeared', () => {
    const oldItem = row({ key: 2 });
    const items = [oldItem];
    const newItems = [row({ key: 1 }), row({ key: 2 })];

    const changedRows = applyRowChanges(items, newItems, [0]);

    expect(items).toEqual([newItems[0], oldItem]);
    expect(changedRows).toEqual([{ changeType: 'insert', rowIndex: 0, item: newItems[0] }]);
  });

  it('should remove the row that is gone', () => {
    const keptItem = row({ key: 2 });
    const items = [row({ key: 1 }), keptItem];
    const newItems = [row({ key: 2 })];

    const changedRows = applyRowChanges(items, newItems, [0]);

    expect(items).toEqual([keptItem]);
    expect(operations(changedRows)).toEqual([['remove', 0]]);
  });

  it('should report an update when another row takes the index', () => {
    const items = [row({ key: 1 })];
    const newItems = [row({ key: 2 })];

    const changedRows = applyRowChanges(items, newItems, [0]);

    expect(items[0]).toBe(newItems[0]);
    expect(changedRows).toEqual([{ changeType: 'update', rowIndex: 0, item: newItems[0] }]);
  });

  it('should report nothing when the row is missing in both lists', () => {
    expect(applyRowChanges([], [], [0])).toEqual([]);
  });

  it('should shift the indices that follow an insert', () => {
    const items = [row({ key: 1 }), row({ key: 2 })];
    const newItems = [row({ key: 3 }), row({ key: 1 }), row({ key: 2 })];

    const changedRows = applyRowChanges(items, newItems, [0, 1]);

    expect(items).toEqual(newItems);
    expect(operations(changedRows)).toEqual([['insert', 0], ['update', 2]]);
  });

  it('should visit the index a remove freed once again', () => {
    const items = [row({ key: 1 }), row({ key: 2 }), row({ key: 3 })];
    const newItems = [row({ key: 1 }), row({ key: 3 })];

    const changedRows = applyRowChanges(items, newItems, [1, 2]);

    expect(items[1]).toBe(newItems[1]);
    expect(operations(changedRows)).toEqual([['remove', 1], ['update', 1]]);
  });

  it('should apply a duplicated index once', () => {
    const items = [row({ key: 1 })];
    const newItems = [row({ key: 1 })];

    const changedRows = applyRowChanges(items, newItems, [0, 0]);

    expect(operations(changedRows)).toEqual([['update', 0]]);
  });

  it('should take the row by the absolute index and report the visible one', () => {
    const invisibleItem = row({ key: 1 });
    const oldItem = row({ key: 2 });
    const items = [invisibleItem, oldItem];
    const newItems = [row({ key: 1 }), row({ key: 2 })];
    const getUpdatedColumnIndices = jest.fn<GetUpdatedColumnIndices>(() => []);

    const changedRows = applyRowChanges(items, newItems, [0], {
      rowIndexDelta: 1,
      getUpdatedColumnIndices,
    });

    expect(items[0]).toBe(invisibleItem);
    expect(items[1]).toBe(newItems[1]);
    expect(newItems[1].rowIndex).toBe(1);
    expect(operations(changedRows)).toEqual([['update', 0]]);
    expect(getUpdatedColumnIndices.mock.calls).toEqual([[oldItem, newItems[1], 0]]);
  });

  it('should not report the update as a live one', () => {
    const items = [row({ key: 1 })];
    const newItems = [row({ key: 1 })];
    const getUpdatedColumnIndices = jest.fn<GetUpdatedColumnIndices>(() => []);

    applyRowChanges(items, newItems, [0], { getUpdatedColumnIndices });

    expect(getUpdatedColumnIndices.mock.calls[0][3]).toBeUndefined();
  });

  it('should report only the visibility when it changed', () => {
    const items = [row({ key: 1, visible: true })];
    const newItems = [row({ key: 1, visible: false })];
    const getUpdatedColumnIndices = jest.fn<GetUpdatedColumnIndices>(() => []);

    const changedRows = applyRowChanges(items, newItems, [0], { getUpdatedColumnIndices });

    expect(items[0]).toBe(newItems[0]);
    expect(changedRows).toEqual([{
      changeType: 'update',
      rowIndex: 0,
      item: { visible: false },
    }]);
    expect(getUpdatedColumnIndices).not.toHaveBeenCalled();
  });

  it('should update the cells the updated column indices point at', () => {
    const oldItem = trackedRow(1);
    const items = [oldItem];
    const newItems = [row({ key: 1 })];
    const getUpdatedColumnIndices = jest.fn<GetUpdatedColumnIndices>(() => [1]);

    const changedRows = applyRowChanges(items, newItems, [0], { getUpdatedColumnIndices });

    expect(changedRows[0].columnIndices).toEqual([1]);
    expect(getUpdatedColumnIndices.mock.calls).toEqual([[oldItem, newItems[0], 0]]);
    expect(updateOf(oldItem)).toHaveBeenCalledWith(newItems[0]);
  });

  it('should repaint the whole row when the column indices are not asked for', () => {
    const oldItem = trackedRow(1);
    const items = [oldItem];
    const newItems = [row({ key: 1 })];

    const changedRows = applyRowChanges(items, newItems, [0]);

    expect(changedRows[0].columnIndices).toBeUndefined();
    expect(updateOf(oldItem)).not.toHaveBeenCalled();
    expect(newItems[0].cells).toBeUndefined();
  });
});

describe('resolveRepaintChangesOnly', () => {
  it('should leave the mode unset when the operation types are unknown', () => {
    expect(resolveRepaintChangesOnly(undefined, true)).toBeUndefined();
  });

  it('should turn the mode off for the operations that rebuild the rows', () => {
    expect(resolveRepaintChangesOnly({ grouping: true }, true)).toBe(false);
    expect(resolveRepaintChangesOnly({ filtering: true }, true)).toBe(false);
  });

  it('should keep the option for the other operations', () => {
    expect(resolveRepaintChangesOnly({ paging: true }, true)).toBe(true);
    expect(resolveRepaintChangesOnly({ paging: true }, false)).toBe(false);
    expect(resolveRepaintChangesOnly({ paging: true }, undefined)).toBeUndefined();
  });
});

describe('syncRowsAfterChange', () => {
  const syncRows = (
    items: ProcessedItem[],
    options: Partial<Parameters<typeof syncRowsAfterChange>[1]> = {},
  ): void => syncRowsAfterChange(items, {
    newItems: items,
    oldItems: null,
    rowIndexDelta: 0,
    ...options,
  });

  it('should number the rows with their visible indices', () => {
    const items = [row({ key: 1 }), row({ key: 2 })];

    syncRows(items, { rowIndexDelta: 1 });

    expect(items.map((item) => item.rowIndex)).toEqual([-1, 0]);
  });

  it('should carry over the cells rendered at the same positions', () => {
    const cells = [{}];
    const items = [row({ key: 1 })];

    syncRows(items, { oldItems: [row({ key: 2, cells })] });

    expect(items[0].cells).toBe(cells);
  });

  it('should give a row with no rendered cells an empty list', () => {
    const items = [row({ key: 1, cells: [{}] })];

    syncRows(items, { oldItems: [row({ key: 1 })] });

    expect(items[0].cells).toEqual([]);
  });

  it('should keep the cells when the rows do not line up', () => {
    const cells = [{}];
    const items = [row({ key: 1, cells })];

    syncRows(items);

    expect(items[0].cells).toBe(cells);
  });

  it('should take the load index of the row the change brought', () => {
    const items = [row({ key: 1, loadIndex: 5 }), row({ key: 2, loadIndex: 6 })];

    syncRows(items, { newItems: [row({ key: 1, loadIndex: 7 })] });

    expect(items.map((item) => item.loadIndex)).toEqual([7, 6]);
  });
});
