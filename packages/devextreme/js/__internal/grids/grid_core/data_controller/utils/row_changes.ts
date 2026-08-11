import { equalByValue } from '@js/core/utils/common';

import type {
  ChangedRow, ChangedRows, ProcessedItem, RowOperation, UpdateChange,
} from '../types';

export function equalItems(
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

  return item1.rowType === item2.rowType
    && (item2.rowType !== 'detail' || item1.isEditing === item2.isEditing);
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
  const strict = equalItems(oldItem, oldNextItem) || equalItems(newItem, newNextItem);

  if (oldItem && newItem && equalItems(oldItem, newItem, strict)) {
    return 'update';
  }

  if ((newItem && !oldItem) || (newNextItem && equalItems(oldItem, newNextItem, strict))) {
    return 'insert';
  }

  if ((oldItem && !newItem) || (oldNextItem && equalItems(newItem, oldNextItem, strict))) {
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

export function pushChangedRow(changedRows: ChangedRows, changedRow: ChangedRow): void {
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
