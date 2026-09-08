import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export interface FilterSourceContext {
  readonly excludedColumn?: Column | null;
}
