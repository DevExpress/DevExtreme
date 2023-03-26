// @ts-expect-error
import { rowsModule } from '@js/ui/grid_core/ui.grid_core.rows';
import gridCore from '../module_core';

export const RowsView = rowsModule.views.rowsView;

gridCore.registerModule('rows', rowsModule);
