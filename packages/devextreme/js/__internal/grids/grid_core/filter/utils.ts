import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export const isColumnExcluded = (
  column: Column,
  excludedColumn: Column | null,
): boolean => !!excludedColumn && excludedColumn.index === column.index;
