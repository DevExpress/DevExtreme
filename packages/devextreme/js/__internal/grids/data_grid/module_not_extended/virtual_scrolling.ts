import { dataSourceAdapterExtender, virtualScrollingModule } from '@ts/grids/grid_core/virtual_scrolling/index';

import gridCore from '../core';
import dataSourceAdapterProvider from '../data_source_adapter';

gridCore.registerModule('virtualScrolling', virtualScrollingModule);

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
