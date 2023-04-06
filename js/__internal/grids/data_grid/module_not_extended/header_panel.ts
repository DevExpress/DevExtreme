// @ts-expect-error
import { headerPanelModule } from '@js/ui/grid_core/ui.grid_core.header_panel';
import gridCore from '../module_core';

export const HeaderPanel = headerPanelModule.views.headerPanel;

gridCore.registerModule('headerPanel', headerPanelModule);
