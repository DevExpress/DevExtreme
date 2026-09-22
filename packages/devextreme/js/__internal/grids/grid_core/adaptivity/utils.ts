import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RowKey } from '@ts/grids/grid_core/m_types';

import type { AdaptiveDetailRowTarget } from './types';

function isHideableColumn(column: Column): boolean {
  const isGroup = (column?.groupIndex ?? -1) >= 0;

  return column.visible === true
    && !isDefined(column.type)
    && !column.fixed
    && !isGroup;
}

export function getHideableColumns(columns: Column[]): Column[] {
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
