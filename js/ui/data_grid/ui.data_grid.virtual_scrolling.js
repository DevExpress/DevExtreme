import gridCore from './ui.data_grid.core';
import dataSourceAdapter from './ui.data_grid.data_source_adapter';
import virtualScrollingModule from '../grid_core/ui.grid_core.virtual_scrolling';

gridCore.registerModule('virtualScrolling', virtualScrollingModule);

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
