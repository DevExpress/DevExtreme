import { headerPanelModule } from '@ts/grids/grid_core/header_panel/header_panel';

import gridCore from '../core';

export const HeaderPanel = headerPanelModule.views.headerPanel;

gridCore.registerModule('headerPanel', headerPanelModule);
