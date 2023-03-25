import gridCore from './ui.data_grid.core';
import { columnHeadersModule } from '../grid_core/ui.grid_core.column_headers';

export const ColumnHeadersView = columnHeadersModule.views.columnHeadersView;

gridCore.registerModule('columnHeaders', columnHeadersModule);
