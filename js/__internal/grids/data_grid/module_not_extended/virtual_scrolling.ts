import { virtualScrollingModule } from '@js/ui/grid_core/ui.grid_core.virtual_scrolling';
import gridCore from '../module_core';
import dataSourceAdapter from '../module_data_source_adapter';

gridCore.registerModule('virtualScrolling', virtualScrollingModule);

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
