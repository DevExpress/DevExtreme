import type { LangParams } from '@js/common/data';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export interface FilterSourceContext {
  readonly langParams?: LangParams;
  readonly excludedColumn?: Column | null;
}
