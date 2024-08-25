import { isDefined } from '@js/core/utils/type';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import { STICKY_BORDER_WIDTH, StickyPosition } from './const';

export const getColumnFixedPosition = (
  { fixedPosition }: { fixedPosition: StickyPosition | undefined },
): StickyPosition => fixedPosition ?? StickyPosition.Left;

const getStickyOffsetCore = function (
  columns,
  widths: number[],
  columnIndex: number,
  fixedPosition: StickyPosition,
  offsets?: Record<number, Record<string, number>>,
): number {
  const column = columns[columnIndex];
  const isChildColumn = isDefined(column.ownerBand);
  const targetColumnIsRight = fixedPosition === StickyPosition.Right;
  const targetColumnIsSticky = getColumnFixedPosition(column) === StickyPosition.Sticky;
  const processedColumns = targetColumnIsRight
    ? columns.slice(columnIndex + 1) : columns.slice(0, columnIndex).reverse();
  const processedWidths = targetColumnIsRight
    ? widths.slice(columnIndex + 1) : widths.slice(0, columnIndex).reverse();
  let offset = 0;
  let adjacentStickyColumnIndex = 0;
  let nonAdjacentStickyColumnCount = targetColumnIsSticky && processedColumns.length ? 1 : 0;

  processedColumns.forEach((col, colIndex: number) => {
    if (col.fixed && (!isDefined(offsets) || column.ownerBand === col.ownerBand)) {
      const columnIsSticky = getColumnFixedPosition(col) === StickyPosition.Sticky;
      const areNextOnlyFixedColumns = !processedColumns.slice(colIndex + 1)
        .some(({ fixed }: { fixed: boolean }) => !fixed);

      offset += processedWidths[colIndex];

      if (colIndex === 0 && areNextOnlyFixedColumns) {
        nonAdjacentStickyColumnCount = 0;
      } else if (targetColumnIsSticky && columnIsSticky && !areNextOnlyFixedColumns) {
        if (colIndex !== adjacentStickyColumnIndex) {
          nonAdjacentStickyColumnCount += 1;
          adjacentStickyColumnIndex = colIndex + 1;
        } else {
          adjacentStickyColumnIndex += 1;
        }
      }
    }
  });

  if (isChildColumn && isDefined(offsets)) {
    offset += offsets?.[column.ownerBand]?.[fixedPosition] ?? 0;

    return offset;
  }

  return offset - (nonAdjacentStickyColumnCount * STICKY_BORDER_WIDTH);
};

const isFirstOrLastColumn = function (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  column,
  rowIndex: number,
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean {
  const rtlEnabled = that.option('rtlEnabled');
  const methodName = rtlEnabled !== isLast ? 'isLastColumn' : 'isFirstColumn';

  if (column.fixedPosition === StickyPosition.Sticky) {
    const parentColumn = that.getParentColumn(column) ?? column;

    if (that[methodName](parentColumn, 0)) {
      return false;
    }
  }

  return that[methodName](column, rowIndex, onlyWithinBandColumn, fixedPosition);
};

const prevColumnIsFixedCore = function (
  that: ColumnsController,
  column,
  visibleColumns,
): boolean {
  const visibleColumnIndex = that.getVisibleIndex(column.index, 0);
  const prevColumn = visibleColumns?.[visibleColumnIndex - 1];

  return prevColumn?.fixed as boolean
    && (!column.fixed
      || column.fixedPosition === StickyPosition.Sticky
      || column.fixedPosition !== prevColumn?.fixedPosition
    );
};

export const getStickyOffset = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[],
  widths: number[],
  columnIndex: number,
  offsets?: Record<number, Record<string, number>>,
): Record<string, number> {
  const result: Record<string, number> = {};
  const column = columns[columnIndex];

  if (column) {
    const fixedPosition = getColumnFixedPosition(column);

    switch (fixedPosition) {
      case StickyPosition.Sticky: {
        const offsetLeft = getStickyOffsetCore(
          columns,
          widths,
          columnIndex,
          StickyPosition.Left,
          offsets,
        );

        const offsetRight = getStickyOffsetCore(
          columns,
          widths,
          columnIndex,
          StickyPosition.Right,
          offsets,
        );

        result.left = offsetLeft;
        result.right = offsetRight;
        break;
      }
      case StickyPosition.Right: {
        const offsetRight = getStickyOffsetCore(
          columns,
          widths,
          columnIndex,
          StickyPosition.Right,
          offsets,
        );

        result.right = offsetRight;
        break;
      }
      default: {
        const offsetLeft = getStickyOffsetCore(
          columns,
          widths,
          columnIndex,
          StickyPosition.Left,
          offsets,
        );

        result.left = offsetLeft;
      }
    }
  }

  return result;
};

export const prevColumnIsFixed = function (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  column,
  rowIndex: number,
): boolean {
  const parentColumn = that.getParentColumn(column);
  const visibleColumns = that.getVisibleColumns(0);

  if (parentColumn) {
    const isFirstColumn = that.isFirstColumn(column, rowIndex, true);

    if (isFirstColumn) {
      return prevColumnIsFixedCore(that, parentColumn, visibleColumns);
    }
  }

  return prevColumnIsFixedCore(that, column, visibleColumns);
};

export const normalizeOffset = function (offset: Record<string, number>): CSSStyleDeclaration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styleProps: any = {};

  if (isDefined(offset.left)) {
    styleProps.left = `${offset.left}px`;
  }

  if (isDefined(offset.right)) {
    styleProps.right = `${offset.right}px`;
  }

  return styleProps as CSSStyleDeclaration;
};

export const isFirstFixedColumn = function (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  column,
  rowIndex: number,
  onlyWithinBandColumn = false,
  fixedPosition?: StickyPosition,
): boolean {
  return isFirstOrLastColumn(that, column, rowIndex, onlyWithinBandColumn, false, fixedPosition);
};

export const isLastFixedColumn = function (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  column,
  rowIndex: number,
  onlyWithinBandColumn = false,
  fixedPosition?: StickyPosition,
): boolean {
  return isFirstOrLastColumn(that, column, rowIndex, onlyWithinBandColumn, true, fixedPosition);
};
