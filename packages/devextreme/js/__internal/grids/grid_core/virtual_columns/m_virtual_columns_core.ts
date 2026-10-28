import { extend } from '@js/core/utils/extend';

import type { ColumnInfoCallback, ColumnInfoCell } from './types';

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
const normalizeSpan = (span?: number): number => span || 1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- PivotGrid passes untyped cells
export function foreachColumnInfo<T extends ColumnInfoCell = any>(
  info: T[][],
  callback: ColumnInfoCallback<T>,
  rowIndex = 0,
  offsets: number[] = [],
  columnCount?: number,
  lastProcessedIndexes: number[] = [],
): void {
  offsets[rowIndex] = offsets[rowIndex] || 0;

  const row = info[rowIndex];
  const startIndex = lastProcessedIndexes[rowIndex] + 1 || 0;
  let processedColumnCount = 0;
  let colIndex = startIndex;

  if (!row) {
    return;
  }

  for (; colIndex < row.length; colIndex += 1) {
    const cell = row[colIndex];
    const visibleIndex = colIndex + offsets[rowIndex];
    const colspan = normalizeSpan(cell.colspan);

    foreachColumnInfo(
      info,
      callback,
      rowIndex + normalizeSpan(cell.rowspan),
      offsets,
      colspan,
      lastProcessedIndexes,
    );

    offsets[rowIndex] += colspan - 1;

    processedColumnCount += colspan;

    if (cell.rowspan) {
      for (let i = rowIndex + 1; i < rowIndex + cell.rowspan; i += 1) {
        offsets[i] = offsets[i] || 0;
        offsets[i] += normalizeSpan(cell.colspan);
      }
    }

    if (callback(cell, visibleIndex, rowIndex, colIndex) === false) {
      break;
    }
    if (columnCount !== undefined && processedColumnCount >= columnCount) {
      break;
    }
  }

  lastProcessedIndexes[rowIndex] = colIndex;
}

export function createColumnsInfo<T extends ColumnInfoCell>(
  info: T[][],
  startIndex: number,
  endIndex: number,
): T[][] {
  const newInfo: T[][] = [];

  foreachColumnInfo(info, (columnInfo, visibleIndex, rowIndex) => {
    let cell = columnInfo;
    const cellColspan = normalizeSpan(cell.colspan);
    const isVisible = visibleIndex + cellColspan - 1 >= startIndex && visibleIndex < endIndex;

    newInfo[rowIndex] = newInfo[rowIndex] || [];

    if (isVisible) {
      let cellVisibleIndex = visibleIndex;
      let colspan = cellColspan;

      if (visibleIndex < startIndex) {
        colspan = cellColspan - (startIndex - visibleIndex);
        cellVisibleIndex = startIndex;
      }

      if (cellVisibleIndex + colspan > endIndex) {
        colspan = endIndex - cellVisibleIndex;
      }

      if (colspan !== cellColspan) {
        // @ts-expect-error extend() can't keep the generic cell type
        cell = extend({}, cell, {
          colspan,
        });
      }

      newInfo[rowIndex].push(cell);
    } else if (visibleIndex > endIndex) {
      return false;
    }

    return undefined;
  });

  for (let i = 0; i < newInfo.length; i += 1) {
    newInfo[i] = newInfo[i] || [];
  }

  return newInfo;
}
