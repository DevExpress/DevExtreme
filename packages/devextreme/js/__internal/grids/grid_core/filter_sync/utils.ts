import type { FilterField } from '@ts/grids/grid_core/columns_controller/types';

export function getColumnIdentifier(column: FilterField): string | undefined {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return column.name || column.dataField;
}
