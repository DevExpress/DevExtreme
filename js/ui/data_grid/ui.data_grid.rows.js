import gridCore from './ui.data_grid.core';
import rowsViewModule from '../grid_core/ui.grid_core.rows';

exports.RowsView = rowsViewModule.views.rowsView;

gridCore.registerModule('rows', rowsViewModule);
