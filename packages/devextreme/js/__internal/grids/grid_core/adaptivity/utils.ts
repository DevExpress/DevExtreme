import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RowKey } from '@ts/grids/grid_core/types';

import { HIDDEN_COLUMNS_WIDTH } from './const';
import type { AdaptiveDetailRowTarget } from './types';

export function hasHiddenWidth(column: Pick<Column, 'visibleWidth'> | undefined): boolean {
  return column?.visibleWidth === HIDDEN_COLUMNS_WIDTH;
}

function isHideableColumn(column: Column): boolean {
  const isGroup = (column?.groupIndex ?? -1) >= 0;

  return column.visible === true
    && !isDefined(column.type)
    && !column.fixed
    && !isGroup;
}

export function getHideableColumns<T extends Column>(columns: T[]): T[] {
  return columns.filter(isHideableColumn);
}

export function resolveAdaptiveDetailRowTarget(
  key: RowKey | undefined,
  rowIndex: number,
  expandedRowIndex: number,
  alwaysExpanded: boolean,
): AdaptiveDetailRowTarget {
  const isCollapsing = !alwaysExpanded
    && expandedRowIndex >= 0
    && expandedRowIndex === rowIndex;

  return isCollapsing ? { key: undefined, rowIndex: -1 } : { key, rowIndex };
}

export function getAdaptiveDetailRowIndex(dataRowIndex: number, rowIndexDelta = 0): number {
  const detailRowIndex = dataRowIndex >= 0 ? dataRowIndex + 1 : dataRowIndex;

  return detailRowIndex - rowIndexDelta;
}
