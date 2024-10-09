import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import type { ColumnsControllerProperties } from './columns_controller/types';
import type * as DataControllerModule from './data_controller';
import type { EditingProperties } from './editing/types';
import type { FilterPanelProperties } from './filtering/filter_panel/types';
import type { HeaderPanelProperties } from './header_panel/types';
import type { SearchProperties } from './search/types';
import type { GridCoreNew } from './widget_base';

export type Properties =
  & WidgetOptions<GridCoreNew>
  & DataControllerModule.Options
  & HeaderPanelProperties
  & ColumnsControllerProperties
  & FilterPanelProperties
  & SearchProperties
  & EditingProperties
  & {
    noDataText?: string;
  };
