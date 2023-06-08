import { virtualScrollingModule } from '@ts/grids/grid_core/virtual_scrolling/m_virtual_scrolling';

import gridCore from '../m_core';
import dataSourceAdapter from '../m_data_source_adapter';

gridCore.registerModule('virtualScrolling', virtualScrollingModule);

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
