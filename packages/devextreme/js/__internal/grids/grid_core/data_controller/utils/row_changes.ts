import { equalByValue } from '@js/core/utils/common';

import type {
  ChangedRows, ProcessedItem, RowOperation, UpdateChange,
  UpdateRowChange,
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

export function isSameGroupRowState(item1: ProcessedItem, item2: ProcessedItem): boolean {
  return item1.isExpanded === item2.isExpanded
    && item1.data?.isContinuation === item2.data?.isContinuation
    && item1.data?.isContinuationOnNextPage === item2.data?.isContinuationOnNextPage;
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

export function resetChangedRows(change: UpdateChange): ChangedRows {
  const changedRows: ChangedRows = {
    items: [],
    rowIndices: [],
    changeTypes: [],
    columnIndices: [],
  };

  change.items = changedRows.items;
  change.rowIndices = changedRows.rowIndices;
  change.changeTypes = changedRows.changeTypes;
  change.columnIndices = changedRows.columnIndices;

  return changedRows;
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
