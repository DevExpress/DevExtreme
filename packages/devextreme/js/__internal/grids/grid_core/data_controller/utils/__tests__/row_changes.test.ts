import {
  describe, expect, it, jest,
} from '@jest/globals';

import type {
  ChangedRows, DataChange, ProcessedItem, UpdateChange,
} from '../../types';
import {
  getChangedRowIndices, getDataRowIndex, getRowKey,
  getRowOperation, indexRowsByKey, isSameGroupRowState, isSameItem,
  markUpdateChange, pushChangedRow, resetChangedRows, updateRowCells,
} from '../row_changes';

const row = (partial: Partial<ProcessedItem>): ProcessedItem => ({
  rowType: 'data',
  data: {},
  values: [],
  ...partial,
} as ProcessedItem);

const emptyChangedRows = (): ChangedRows => ({
  items: [],
  rowIndices: [],
  changeTypes: [],
  columnIndices: [],
});

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

describe('resetChangedRows', () => {
  it('should empty the change and keep the very same arrays', () => {
    const change = {
      changeType: 'update',
      rowIndices: [1, 2],
      items: [row({ key: 1 })],
    } as UpdateChange;

    const changedRows = resetChangedRows(change);

    expect(change.items).toBe(changedRows.items);
    expect(change.rowIndices).toBe(changedRows.rowIndices);
    expect(change.changeTypes).toBe(changedRows.changeTypes);
    expect(change.columnIndices).toBe(changedRows.columnIndices);
    expect(changedRows.rowIndices).toEqual([]);
    expect(changedRows.items).toEqual([]);
  });
});

describe('markUpdateChange', () => {
  const refreshChange = (): DataChange => ({ changeType: 'refresh', items: [row({ key: 1 })] });

  it('should turn the refresh change into a partial update carrying the rows', () => {
    const change = refreshChange();
    const changedRows = emptyChangedRows();

    markUpdateChange(change, changedRows);

    const updateChange = change as UpdateChange;
    expect(updateChange.changeType).toBe('update');
    expect(updateChange.repaintChangesOnly).toBe(true);
    expect(updateChange.items).toBe(changedRows.items);
    expect(updateChange.rowIndices).toBe(changedRows.rowIndices);
    expect(updateChange.changeTypes).toBe(changedRows.changeTypes);
    expect(updateChange.columnIndices).toBe(changedRows.columnIndices);
  });
});

describe('pushChangedRow', () => {
  it('should push the changed row to every list', () => {
    const changedRows = emptyChangedRows();
    const item = row({ key: 1 });

    pushChangedRow(changedRows, {
      changeType: 'update',
      rowIndex: 3,
      item,
      columnIndices: [0, 2],
    });

    expect(changedRows.items).toEqual([item]);
    expect(changedRows.rowIndices).toEqual([3]);
    expect(changedRows.changeTypes).toEqual(['update']);
    expect(changedRows.columnIndices).toEqual([[0, 2]]);
  });

  it('should skip the item when the row is gone from the new list', () => {
    const changedRows = emptyChangedRows();

    pushChangedRow(changedRows, { changeType: 'remove', rowIndex: 5 });

    expect(changedRows.items).toEqual([]);
    expect(changedRows.rowIndices).toEqual([5]);
    expect(changedRows.changeTypes).toEqual(['remove']);
    expect(changedRows.columnIndices).toEqual([undefined]);
  });
});
