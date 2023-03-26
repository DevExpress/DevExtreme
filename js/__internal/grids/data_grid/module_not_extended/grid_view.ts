// @ts-expect-error
import { gridViewModule } from '@js/ui/grid_core/ui.grid_core.grid_view';
import gridCore from '../module_core';

gridCore.registerModule('gridView', gridViewModule);
