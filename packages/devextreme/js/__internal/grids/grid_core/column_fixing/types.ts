import type { dxElementWrapper } from '@js/core/renderer';
import type { FooterView } from '@ts/grids/data_grid/summary/m_summary';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { RowRenderOptions } from '@ts/grids/grid_core/views/types';

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

export type ColumnFixingColumnHeadersView = ColumnHeadersView
& ColumnFixingColumnHeadersViewExtension;

export type ColumnFixingRowsView = RowsView & ColumnFixingColumnsViewExtension;

export interface ColumnFixingRowRenderOptions extends RowRenderOptions {
  isFixed?: boolean;
}

/** @architectureLeak data_grid/summary: only DataGrid registers the footer view */
export type ColumnFixingFooterView = FooterView & ColumnFixingColumnsViewExtension;
