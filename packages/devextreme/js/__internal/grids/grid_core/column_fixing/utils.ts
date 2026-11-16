import { each } from '@ts/core/utils/iterator';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DraggingPanel } from '@ts/grids/grid_core/columns_resizing_reordering/types';
import type { ColumnPoint } from '@ts/grids/grid_core/types';

import { COMMAND_TRANSPARENT } from './const';
import type { ColumnFixingColumnHeadersView } from './types';

export const getTransparentColumnIndex = (
  fixedColumns: Column[],
): number => fixedColumns.findIndex((column) => column.command === COMMAND_TRANSPARENT);

export const normalizeColumnWidths = (
  fixedColumns: Column[],
  widths: number[],
  fixedWidths: number[] | undefined,
): number[] => {
  if (!fixedColumns || !widths || !fixedWidths) {
    return widths;
  }

  let fixedColumnIndex = 0;

  for (let i = 0; i < fixedColumns.length; i += 1) {
    if (fixedColumns[i].command === COMMAND_TRANSPARENT) {
      // @ts-expect-error the transparent column always has a colspan
      fixedColumnIndex += fixedColumns[i].colspan;
    } else {
      if (widths[fixedColumnIndex] < fixedWidths[i]) {
        widths[fixedColumnIndex] = fixedWidths[i];
      }
      fixedColumnIndex += 1;
    }
  }

  return widths;
};

export const normalizeColumnIndicesByPoints = (
  columns: Column[],
  fixedColumns: Column[],
  pointsByColumns: ColumnPoint[],
): ColumnPoint[] => {
  const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
  const correctIndex = columns.length - fixedColumns.length;

  each(pointsByColumns, (_, point) => {
    if (point.index > transparentColumnIndex) {
      point.columnIndex += correctIndex;
      point.index += correctIndex;
    }
  });

  return pointsByColumns;
};

export const isColumnHeadersPanel = (
  panel: DraggingPanel,
): panel is ColumnFixingColumnHeadersView => panel.getName() === 'headers';
