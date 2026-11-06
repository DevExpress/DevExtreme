import type { SelectionChangedInfo } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { InternalGrid, InternalGridOptions, RowKey } from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ViewCellOptions, ViewRowEvent } from '@ts/grids/grid_core/views/types';

export interface SelectionModifierKeys {
  control?: boolean;
  shift?: boolean;
}

export interface SelectionChangedArgs {
  selectedRowKeys?: RowKey[];
  selectionFilter?: InternalGridOptions['selectionFilter'];
}

export type SelectionChangedOptions = Partial<SelectionChangedInfo<unknown, RowKey>>;

export interface SelectionHeaderCellOptions extends ViewCellOptions {
  component: InternalGrid;
}

export interface SelectionCellOptions extends SelectionHeaderCellOptions {
  row: ProcessedItem;
}

export interface SelectCheckBoxOptions {
  column: Column;
  row: ProcessedItem;
  value?: unknown;
}

export interface SelectionRowsViewExtension {
  renderSelectCheckBoxContainer: (
    $container: dxElementWrapper,
    options: SelectionCellOptions,
  ) => void;
  renderSelectCheckBox: (
    $container: dxElementWrapper,
    options: SelectCheckBoxOptions,
  ) => dxElementWrapper;
  attachCheckBoxClickEvent: ($element: dxElementWrapper) => void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  handleRowClickBySelection(e: ViewRowEvent): void;
}

export type SelectionRowsView = RowsView & SelectionRowsViewExtension;

export interface SelectionColumnHeadersViewExtension {
  attachSelectAllCheckBoxClickEvent: ($element: dxElementWrapper) => void;
  createSelectAllCheckboxElement: (column?: Column) => dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  renderSelectAllCheckBox($container: dxElementWrapper, column?: Column): dxElementWrapper;
}

export type SelectionColumnHeadersView = ColumnHeadersView & SelectionColumnHeadersViewExtension;
