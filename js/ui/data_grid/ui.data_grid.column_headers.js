import gridCore from './ui.data_grid.core';
import columnHeadersViewModule from '../grid_core/ui.grid_core.column_headers';

exports.ColumnHeadersView = columnHeadersViewModule.views.columnHeadersView;

gridCore.registerModule('columnHeaders', columnHeadersViewModule);
