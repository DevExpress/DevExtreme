import { isDefined } from '@js/core/utils/type';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { HIDDEN_COLUMNS_WIDTH } from '../adaptivity/const';
import type { ColumnsController } from '../columns_controller/m_columns_controller';
import { STICKY_BORDER_WIDTH, StickyPosition } from './const';

export const getColumnFixedPosition = (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  column,
): StickyPosition => {
  const { fixedPosition }: { fixedPosition: StickyPosition } = column;
  const rtlEnabled = that.option('rtlEnabled');
  // NOTE: in RTL for master-detail & group rows, command column has already right position
  const isExceptionCommandColumn = column.command
    && column.command === 'expand';
  const isDefaultCommandColumn = column.command
    && !gridCoreUtils.isCustomCommandColumn(that._columns, column);

  if (isDefaultCommandColumn && rtlEnabled && !isExceptionCommandColumn) {
    return fixedPosition === StickyPosition.Right ? StickyPosition.Left : StickyPosition.Right;
  }

  return fixedPosition ?? StickyPosition.Left;
};

export const needToDisableStickyColumn = function (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  column,
): boolean {
  return that.isVirtualMode() && !!column.fixed && column.fixedPosition === StickyPosition.Sticky;
};

/* TODO: Need to rename this method to hasStickyColumns
   after removing old fixed columns implementation */
export const hasFixedColumnsWithStickyPosition = function (that: ColumnsController): boolean {
  if (that.isVirtualMode()) {
    return false;
  }

  return !!that
    .getStickyColumns()
    .filter((column) => column.fixedPosition === StickyPosition.Sticky).length;
};

export const processFixedColumns = function (
  that: ColumnsController,
  columns: object[],
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return columns.map((column: object) => {
    if (needToDisableStickyColumn(that, column)) {
      return { ...column, fixed: false, fixedPosition: '' };
    }

    return column;
  });
};

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
  const targetColumnIsSticky = column.fixedPosition === StickyPosition.Sticky;
  const processedColumns = targetColumnIsRight
    ? columns.slice(columnIndex + 1) : columns.slice(0, columnIndex).reverse();
  const processedWidths = targetColumnIsRight
    ? widths.slice(columnIndex + 1) : widths.slice(0, columnIndex).reverse();
  let offset = 0;
  let adjacentStickyColumnIndex = 0;
  let nonAdjacentStickyColumnCount = targetColumnIsSticky && processedColumns.length ? 1 : 0;

  processedColumns.forEach((col, colIndex: number) => {
    if (col.fixed && (!isDefined(offsets) || column.ownerBand === col.ownerBand)) {
      const columnIsSticky = col.fixedPosition === StickyPosition.Sticky;
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
    } else if (col.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      adjacentStickyColumnIndex += 1;
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

const getPrevColumn = function (
  that: ColumnsController,
  column,
  visibleColumns,
  rowIndex: number | null,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const visibleColumnIndex = that.getVisibleIndex(column.index, rowIndex);

  return visibleColumns?.slice(0, visibleColumnIndex)
    .reverse()
    .find((col) => col.visibleWidth !== HIDDEN_COLUMNS_WIDTH);
};

const prevColumnIsFixedCore = function (
  that: ColumnsController,
  column,
  visibleColumns,
  rowIndex: number | null,
): boolean {
  const prevColumn = getPrevColumn(that, column, visibleColumns, rowIndex);
  const fixedPosition = getColumnFixedPosition(that, column);

  return !!prevColumn?.fixed && !needToDisableStickyColumn(that, prevColumn)
    && (!column.fixed
      || fixedPosition === StickyPosition.Sticky
      || fixedPosition !== getColumnFixedPosition(that, prevColumn)
    );
};

export const getStickyOffset = function (
  that: ColumnsController,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[],
  widths: number[],
  columnIndex: number,
  offsets?: Record<number, Record<string, number>>,
): Record<string, number> {
  const result: Record<string, number> = {};
  const column = columns[columnIndex];

  if (column) {
    const fixedPosition = getColumnFixedPosition(that, column);

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
  rowIndex: number | null,
  isDataColumn = false,
): boolean {
  const visibleColumns = that.getVisibleColumns(isDataColumn ? null : rowIndex);
  const parentColumn = that.getParentColumn(column);

  if (parentColumn) {
    const isFirstColumn = that.isFirstColumn(column, rowIndex, true);

    return isFirstColumn && prevColumnIsFixedCore(that, parentColumn, that.getVisibleColumns(0), 0);
  }

  return prevColumnIsFixedCore(that, column, visibleColumns, rowIndex);
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFixedEdge = function (point, column, nextColumn): boolean {
  const isSplitPoint = isDefined(point.isLeftBoundary) || isDefined(point.isRightBoundary);

  return !isSplitPoint && !!column && !!nextColumn && column.fixed !== nextColumn.fixed;
};
