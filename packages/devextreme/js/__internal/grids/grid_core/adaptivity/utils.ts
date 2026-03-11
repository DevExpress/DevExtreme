import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

const HIDEABLE_COMMAND_COLUMNS = ['ai'];

function isHideableColumn(column: Column): boolean {
  const isGroup = (column?.groupIndex ?? -1) >= 0;

  return column.visible === true
    && (!isDefined(column.type) || HIDEABLE_COMMAND_COLUMNS.includes(column.type))
    && !column.fixed
    && !isGroup;
}

export function getHideableColumns(columns: Column[]): Column[] {
  return columns.filter(isHideableColumn);
}
