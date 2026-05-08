import type { Column as DataGridColumn } from '@js/ui/data_grid';
import type { Column as GridCoreColumn } from '@ts/grids/grid_core/columns_controller/types';

export type Column = GridCoreColumn & DataGridColumn;
