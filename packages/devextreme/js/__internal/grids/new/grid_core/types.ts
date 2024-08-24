import type { ColumnsControllerProperties } from './columns_controller/types';
import type { DataControllerProperties } from './data_controller/types';
import type { EditingProperties } from './editing/types';
import type { FilterPanelProperties } from './filtering/filter_panel/types';
import type { HeaderPanelProperties } from './header_panel/types';
import type { SearchProperties } from './search/types';

export type Properties =
  & DataControllerProperties
  & HeaderPanelProperties
  & ColumnsControllerProperties
  & FilterPanelProperties
  & SearchProperties
  & EditingProperties
  & {
    noDataText?: string;
  };
