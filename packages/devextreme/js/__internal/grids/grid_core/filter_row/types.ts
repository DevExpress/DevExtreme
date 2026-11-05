import type { FilterRow, FilterRowOperationDescriptions } from '@js/common/grids';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import type Overlay from '@ts/ui/overlay/overlay';

export type FilterRowEditorOptions = Omit<Column, 'width'> & {
  value: unknown;
  parentType: 'filterRow';
  showAllText?: string;
  updateValueTimeout: number;
  width: null;
  setValue: (value: unknown, notFireEvent?: boolean) => void;
  placeholder?: string;
};

export type FilterRowOptions = FilterRow & {
  operationDescriptions?: FilterRowOperationDescriptions & {
    isBlank?: string;
    isNotBlank?: string;
  };
};

export interface FilterRowColumnHeadersViewExtension {
  getFilterRangeOverlayInstance: () => Overlay | null | undefined;
  updateLookupDataSource: (filterChanged?: unknown) => void;
}

export type FilterRowColumnHeadersView = ColumnHeadersView & FilterRowColumnHeadersViewExtension;

export interface FilterRowHeaderPanelExtension {
  enableApplyButton: (value: boolean) => void;
}

export type FilterRowHeaderPanel = HeaderPanel & FilterRowHeaderPanelExtension;
