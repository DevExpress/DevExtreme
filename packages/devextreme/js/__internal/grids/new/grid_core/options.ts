import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import type { ColumnsControllerProperties } from './columns_controller/types';
import type { DataControllerProperties } from './data_controller/options';
import type { EditingProperties } from './editing/types';
import type { FilterPanelProperties } from './filtering/filter_panel/types';
import type { HeaderPanelProperties } from './header_panel/types';
import type { SearchProperties } from './search/types';
import type { GridCoreNew } from './widget_base';

export type Properties =
  & WidgetOptions<GridCoreNew>
  & DataControllerProperties
  & HeaderPanelProperties
  & ColumnsControllerProperties
  & FilterPanelProperties
  & SearchProperties
  & EditingProperties
  & {
    noDataText?: string;
  };
