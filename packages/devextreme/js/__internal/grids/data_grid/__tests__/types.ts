import type DataGrid from '@js/ui/data_grid';
import type { Controllers } from '@ts/grids/grid_core/m_types';

export interface DataGridWithControllers extends DataGrid {
  getController: <T extends keyof Controllers>(name: T) => Controllers[T];
}
