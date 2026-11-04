import type { dxElementWrapper } from '@js/core/renderer';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';

export interface ColumnFixingColumnsViewExtension {
  _isFixedTableRendering: boolean;
  isFixedColumns: () => boolean;
  getFixedColumns: (rowIndex?: number) => Column[];
  getFixedTableElement: () => dxElementWrapper | null | undefined;
  getTransparentColumnElement: () => dxElementWrapper | null | undefined;
}

export interface ColumnFixingColumnHeadersViewExtension extends ColumnFixingColumnsViewExtension {
  getFixedColumnElements: (rowIndex?: number) => dxElementWrapper | null | undefined;
}

export type ColumnFixingRowsView = RowsView & ColumnFixingColumnsViewExtension;
