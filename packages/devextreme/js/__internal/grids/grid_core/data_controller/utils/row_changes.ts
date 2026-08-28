import { equalByValue } from '@js/core/utils/common';

import type {
  ChangedRows, DataChange, ItemChange, ProcessedItem, RowIndexByKey,
  RowOperation, UpdateChange, UpdateRowChange,
} from '../types';

export function isSameItem(
  item1?: ProcessedItem,
  item2?: ProcessedItem,
  strict?: boolean,
): boolean {
  if (!item1 || !item2 || !equalByValue(item1.key, item2.key)) {
    return false;
  }

  if (!strict) {
    return true;
  }

  const isSameRowType = item1.rowType === item2.rowType;
  const isDetailRow = item2.rowType === 'detail';
  const isSameEditingState = item1.isEditing === item2.isEditing;

  return isSameRowType && (!isDetailRow || isSameEditingState);
}

// TODO remove after related checks moved to extenders (duplicated in grouping)
export function isSameGroupRowState(item1: ProcessedItem, item2: ProcessedItem): boolean {
  return item1.isExpanded === item2.isExpanded
    && item1.data?.isContinuation === item2.data?.isContinuation
    && item1.data?.isContinuationOnNextPage === item2.data?.isContinuationOnNextPage;
}

export function canDiffColumns(oldItem: ProcessedItem, newItem: ProcessedItem): boolean {
  return oldItem.rowType === newItem.rowType && newItem.rowType !== 'groupFooter';
}

export function getGroupColumnIndices(
  oldItem: ProcessedItem,
  newItem: ProcessedItem,
): number[] | undefined {
  if (!oldItem.cells || !isSameGroupRowState(oldItem, newItem)) {
    return undefined;
  }

  return oldItem.cells
    .map((cell, index) => (cell.column?.type !== 'groupExpand' ? index : -1))
    .filter((index) => index >= 0);
}

/**
 * Rows of different types may share a key, so the row type is a part of the key
 * the diff is built on.
 */
export function getRowKey(row: ProcessedItem): string {
  return `${row.rowType},${JSON.stringify(row.key)}`;
}

/**
 * Numbers the rows and maps their keys to the new indices: both the diff and
 * the row index correction look rows up by key.
 */
export function indexRowsByKey(items: ProcessedItem[]): RowIndexByKey {
  const indexByKey: RowIndexByKey = {};

  items.forEach((item, index) => {
    indexByKey[getRowKey(item)] = index;
    item.rowIndex = index;
  });

  return indexByKey;
}

/**
 * Refreshes a rendered row in place: the rows view's updaters take the new row
 * instead of the old one. A row that was never rendered has no cells to update.
 */
export function updateRowCells(oldItem: ProcessedItem, newItem: ProcessedItem): void {
  if (!oldItem.cells) {
    return;
  }

  oldItem.update?.(newItem);
  oldItem.cells.forEach((cell) => {
    cell?.update?.(newItem, true);
  });
}

export function updateKeptRows(
  oldItems: ProcessedItem[],
  newItems: ProcessedItem[],
  newIndexByKey: RowIndexByKey,
  itemChanges: ItemChange[],
): void {
  const changedItemKeys = new Set<string>();

  itemChanges.forEach((itemChange) => {
    changedItemKeys.add(getRowKey(
      itemChange.type === 'insert' ? itemChange.data : itemChange.oldItem,
    ));
  });

  oldItems.forEach((oldItem) => {
    const key = getRowKey(oldItem);
    const newIndex = newIndexByKey[key];

    if (newIndex === undefined || changedItemKeys.has(key)) {
      return;
    }

    updateRowCells(oldItem, newItems[newIndex]);
  });
}

/**
 * A store change is indexed by data rows, while an insert index coming from the
 * grid counts every visible row — group rows included.
 */
export function getDataRowIndex(rows: ProcessedItem[], visibleRowIndex: number): number {
  const previousRows = rows.slice(0, visibleRowIndex);

  return previousRows.filter((row) => row?.rowType === 'data' || row?.rowType === 'group').length;
}

export function getChangedRowIndices(
  rowIndices: number[],
  rowIndexDelta: number,
  allowInvisibleRowIndices?: boolean,
): number[] {
  const correction = allowInvisibleRowIndices ? rowIndexDelta : 0;

  return rowIndices
    .slice()
    .sort((a, b) => a - b)
    .filter((rowIndex) => rowIndex + correction >= 0);
}

export function getRowOperation(
  oldItems: ProcessedItem[],
  newItems: ProcessedItem[],
  rowIndex: number,
): RowOperation | undefined {
  const oldItem = oldItems[rowIndex];
  const oldNextItem = oldItems[rowIndex + 1];
  const newItem = newItems[rowIndex];
  const newNextItem = newItems[rowIndex + 1];
  const strict = isSameItem(oldItem, oldNextItem) || isSameItem(newItem, newNextItem);

  const isSameRow = isSameItem(oldItem, newItem, strict);
  const isRowAdded = !oldItem && !!newItem;
  const isRowDeleted = !!oldItem && !newItem;
  const isOldRowMovedDown = isSameItem(oldItem, newNextItem, strict);
  const isNewRowMovedUp = isSameItem(newItem, oldNextItem, strict);

  if (isSameRow) {
    return 'update';
  }

  if (isRowAdded || isOldRowMovedDown) {
    return 'insert';
  }

  if (isRowDeleted || isNewRowMovedUp) {
    return 'remove';
  }

  return newItem ? 'replace' : undefined;
}

export function initChangedRows(): ChangedRows {
  return {
    items: [],
    rowIndices: [],
    changeTypes: [],
    columnIndices: [],
  };
}

function attachChangedRows(change: UpdateChange, changedRows: ChangedRows): void {
  change.rowIndices = changedRows.rowIndices;
  change.columnIndices = changedRows.columnIndices;
  change.changeTypes = changedRows.changeTypes;
  change.items = changedRows.items;
}

export function resetChangedRows(change: UpdateChange): ChangedRows {
  const changedRows = initChangedRows();

  attachChangedRows(change, changedRows);

  return changedRows;
}

function toChangedRows(updateRowChanges: UpdateRowChange[]): ChangedRows {
  return {
    items: updateRowChanges
      .map(({ item }) => item)
      .filter((item): item is ProcessedItem => !!item),
    rowIndices: updateRowChanges.map(({ rowIndex }) => rowIndex),
    changeTypes: updateRowChanges.map(({ changeType }) => changeType),
    columnIndices: updateRowChanges.map(({ columnIndices }) => columnIndices),
  };
}

export function convertToUpdateChange(
  change: DataChange,
  updateRowChanges: UpdateRowChange[],
): void {
  const updateChange = change as UpdateChange;

  updateChange.repaintChangesOnly = true;
  updateChange.changeType = 'update';

  attachChangedRows(updateChange, toChangedRows(updateRowChanges));
}

export function pushChangedRow(changedRows: ChangedRows, changedRow: UpdateRowChange): void {
  const {
    item, rowIndex, changeType, columnIndices,
  } = changedRow;

  if (item) {
    changedRows.items.push(item);
  }

  changedRows.rowIndices.push(rowIndex);
  changedRows.changeTypes.push(changeType);
  changedRows.columnIndices.push(columnIndices);
}

export function partialUpdateRow(
  oldItem: ProcessedItem,
  newItem: ProcessedItem,
  columnIndices: number[] | undefined,
  isLiveUpdate?: boolean,
): void {
  if (!columnIndices) {
    return;
  }

  oldItem.cells?.forEach((cell, columnIndex) => {
    const isCellChanged = columnIndices.includes(columnIndex);
    if (!isCellChanged && cell?.update) {
      cell.update(newItem);
    }
  });

  newItem.update = oldItem.update;
  newItem.watch = oldItem.watch;
  newItem.cells = oldItem.cells;

  if (isLiveUpdate) {
    newItem.oldValues = oldItem.values;
  }

  oldItem.update?.(newItem);
}
