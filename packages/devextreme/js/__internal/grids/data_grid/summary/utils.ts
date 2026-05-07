import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export function getSummaryCellIndex(
  column: Column,
  prevColumn?: Column,
  isGroupRow = false,
): number {
  const cellIndex = column.index ?? -1;

  if (!isGroupRow) {
    return cellIndex;
  }

  if (prevColumn?.type === 'groupExpand' || column.type === 'groupExpand') {
    return prevColumn?.index ?? -1;
  }

  return !isDefined(column.groupIndex) ? cellIndex : -1;
}

export function getColumnFromMap(
  identifier: string | number | undefined,
  columnMap: Map<string | number, Column>,
): Column | undefined {
  return identifier !== undefined ? columnMap.get(identifier) : undefined;
}
