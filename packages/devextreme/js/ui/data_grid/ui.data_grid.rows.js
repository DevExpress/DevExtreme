import gridCore from './ui.data_grid.core';
import { rowsModule } from '../grid_core/ui.grid_core.rows';

export const RowsView = rowsModule.views.rowsView;

gridCore.registerModule('rows', rowsModule);
