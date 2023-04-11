// @ts-expect-error
import { headerPanelModule } from '@js/ui/grid_core/ui.grid_core.header_panel';
import treeListCore from '../module_core';

treeListCore.registerModule('headerPanel', headerPanelModule);
