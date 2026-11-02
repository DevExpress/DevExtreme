import type { RowsView } from '@ts/grids/grid_core/views/rows_view';

export interface ColumnFixingRowsViewExtension {
  _isFixedTableRendering: boolean;
}

export type ColumnFixingRowsView = RowsView & ColumnFixingRowsViewExtension;
