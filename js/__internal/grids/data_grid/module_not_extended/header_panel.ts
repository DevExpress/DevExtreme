import { headerPanelModule } from '@ts/grids/grid_core/header_panel/m_header_panel';

import gridCore from '../m_core';

export const HeaderPanel = headerPanelModule.views.headerPanel;

gridCore.registerModule('headerPanel', headerPanelModule);
