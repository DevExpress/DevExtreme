/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '@ts/core/di/index';
import { SearchUIController } from '@ts/grids/new/grid_core/search/index';

import { AccessibilityController } from './accessibility/controller';
import * as ColumnChooserModule from './column_chooser/index';
import * as ColumnsControllerModule from './columns_controller/index';
import * as DataControllerModule from './data_controller/index';
import { ConfirmController } from './editing/confirm_controller';
import { EditingController } from './editing/controller';
import { EditPopupView } from './editing/popup/view';
import { ErrorController } from './error_controller/error_controller';
import * as FilterSyncModule from './filtering/filter_sync/index';
import {
  CompatibilityHeaderFilterController,
  HeaderFilterController,
  HeaderFilterPopupView,
} from './filtering/header_filter/index';
import { HeaderFilterViewController } from './filtering/header_filter/view_controller';
import * as FilterControllerModule from './filtering/index';
import { ItemsController } from './items_controller/items_controller';
import { KeyboardNavigationController } from './keyboard_navigation/index';
import * as Lifecycle from './lifecycle/index';
import { OptionsValidationController } from './options_validation/index';
import { PagerView } from './pager/view';
import { SearchController } from './search/controller';
import { SearchView } from './search/view';
import * as SelectionControllerModule from './selection/index';
import * as SortingControllerModule from './sorting_controller/index';
import { ToolbarController } from './toolbar/controller';
import { ToolbarView } from './toolbar/view';

export function register(diContext: DIContext): void {
  diContext.register(DataControllerModule.DataController);
  diContext.register(DataControllerModule.CompatibilityDataController);
  diContext.register(ItemsController);
  diContext.register(ColumnsControllerModule.ColumnsController);
  diContext.register(SelectionControllerModule.Controller);
  diContext.register(ColumnsControllerModule.CompatibilityColumnsController);
  diContext.register(SortingControllerModule.SortingController);
  diContext.register(ToolbarController);
  diContext.register(ToolbarView);
  diContext.register(PagerView);
  diContext.register(SearchController);
  diContext.register(SearchView);
  diContext.register(ColumnChooserModule.ColumnChooserController);
  diContext.register(ColumnChooserModule.ColumnChooserView);
  diContext.register(FilterControllerModule.FilterController);
  diContext.register(FilterControllerModule.FilterPanelView);
  diContext.register(HeaderFilterController);
  diContext.register(HeaderFilterPopupView);
  diContext.register(FilterSyncModule.FilterSyncController);
  diContext.register(FilterSyncModule.CompatibilityFilterSyncController);
  diContext.register(CompatibilityHeaderFilterController);
  diContext.register(ErrorController);
  diContext.register(EditingController);
  diContext.register(ConfirmController);
  diContext.register(EditPopupView);
  diContext.register(SearchUIController);
  diContext.register(SearchView);
  diContext.register(HeaderFilterViewController);

  diContext.register(KeyboardNavigationController);
  diContext.register(AccessibilityController);
  diContext.register(OptionsValidationController);
  diContext.register(Lifecycle.Controller);
}
