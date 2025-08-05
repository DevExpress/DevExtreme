import type { FilterType } from '@js/common/grids';
import type { DataSourceLike } from '@js/data/data_source';
import type { FilterValue } from '@ts/grids/new/grid_core/filtering/types';

import type { Column } from '../../columns_controller/types';

export type HeaderFilterSearchMode = 'contains' | 'startswith' | 'equals';
export type HeaderFilterType = 'include' | 'exclude';
export type HeaderFilterListType = 'tree' | 'list';

export interface PopupOptions {
  type: HeaderFilterListType;
  column: Column;
  headerFilter: HeaderFilterColumnOptions;
  dataSource?: DataSourceLike<unknown>;
  isFilterBuilder?: boolean;
  filterType?: FilterType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterValues?: any[];
  apply: () => void;
  hidePopupCallback: () => void;
}

export type PopupState = {
  element: Element;
  options: PopupOptions;
} | null;

export interface HeaderFilterTextOptions {
  // Specifies text for the button that applies the specified filter.
  ok?: string;
  // Specifies text for the button that closes the popup menu without applying a filter.
  cancel?: string;
  // Specifies a name for the item that represents empty values in the popup menu.
  emptyValue?: string;
}

export interface HeaderFilterSearchBaseOptions {
  // An object defining configuration properties for the TextBox UI component (Search editor)
  // NOTE: Original DataGrid type not typed too:
  // https://js.devexpress.com/jQuery/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/headerFilter/search/#editorOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorOptions?: any;
  // Specifies whether search UI is enabled in the header filter.
  enabled?: boolean;
  // Specifies a comparison operation used to search header filter values.
  mode?: HeaderFilterSearchMode;
  // Specifies a timeout, in milliseconds, during which a user may continue
  // to modify the search value without starting the search operation.
  timeout?: number;
}

export interface HeaderFilterSearchColumnOptions extends HeaderFilterSearchBaseOptions {
  // Specifies a data object's field name
  // or an expression whose value is compared to the search string
  searchExpr?: string | Function | (string | Function)[];
}

export interface HeaderFilterSearchRootOptions extends HeaderFilterSearchBaseOptions {}

export interface HeaderFilterBaseOptions {
  // Specifies whether a "Select All" option is available to users
  allowSelectAll?: boolean;
  // Specifies the height of the popup menu containing filtering values.
  height?: number | string;
  // Specifies the width of the popup menu that contains values for filtering.
  width?: number | string;
}

export interface HeaderFilterColumnOptions extends HeaderFilterBaseOptions {
  // Specifies the header filter's data source.
  dataSource?: DataSourceLike<unknown>;
  // Specifies how the header filter combines values into groups.
  // Does not apply if you specify a custom header filter data source
  // TODO: Maybe we should add values for dates to this option
  // Type described here: https://js.devexpress.com/jQuery/Documentation/ApiReference/Common_Types/grids/#HeaderFilterGroupInterval
  groupInterval?: number;
  // Specifies the header filter search options.
  search?: HeaderFilterSearchColumnOptions;
}

export interface HeaderFilterRootOptions extends HeaderFilterBaseOptions {
  // Specifies the header filter search options.
  search?: HeaderFilterSearchRootOptions;
  // Translations for header filter popup.
  texts?: HeaderFilterTextOptions;
  // Specifies whether the header filter can be used to filter data by this column
  visible?: boolean;
}

export type HeaderFilterValuesType = 'single-value' | 'values-or-condition' | 'empty';

export interface HeaderFilterInfo {
  type: HeaderFilterValuesType;
  columnId: string;
  filterType: FilterType;
  filterValues: FilterValue;
  composedFilterValues: FilterValue;
}
