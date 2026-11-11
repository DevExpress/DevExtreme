import type { FilterRow, FilterRowOperationDescriptions, ScalarFilterValue } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Item as MenuItem } from '@js/ui/menu';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import type Overlay from '@ts/ui/overlay/overlay';

/** An array is a `between` range or a multiselect value; an unset range bound stays `undefined`. */
export type FilterRowValue = ScalarFilterValue | FilterRowValue[] | undefined;

export interface FilterRangeSharedData {
  valueChangeTimeout?: ReturnType<typeof setTimeout>;
}

export type FilterRowEditorOptions = Omit<Column, 'width'> & {
  value: FilterRowValue;
  parentType: 'filterRow';
  showAllText?: string;
  updateValueTimeout: number;
  setValue: (value: FilterRowValue, notFireEvent?: boolean) => void;
  placeholder?: string;
  sharedData?: FilterRangeSharedData;
};

export type FilterRowOptions = FilterRow & {
  operationDescriptions?: FilterRowOperationDescriptions & {
    isBlank?: string;
    isNotBlank?: string;
  };
};

export interface FilterRowColumnHeadersViewExtension {
  getFilterRangeOverlayInstance: () => Overlay | null | undefined;
  updateLookupDataSource: (filterChanged?: boolean | DataFilter) => void;
}

export type FilterRowColumnHeadersView = ColumnHeadersView & FilterRowColumnHeadersViewExtension;

export interface FilterRowHeaderPanelExtension {
  enableApplyButton: (value: boolean) => void;
}

export type FilterRowHeaderPanel = HeaderPanel & FilterRowHeaderPanelExtension;

export interface FilterOperationMenuItem extends MenuItem {
  name?: string | null;
  items?: FilterOperationMenuItem[];
}

export interface FilterValueUpdateOptions {
  column: Column;
  value: FilterRowValue;
  container: dxElementWrapper;
  notFireEvent?: boolean;
}
