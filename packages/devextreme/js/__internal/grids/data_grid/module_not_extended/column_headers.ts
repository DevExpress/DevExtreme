import { columnHeadersModule } from '@ts/grids/grid_core/column_headers/column_headers';

import gridCore from '../core';

export const ColumnHeadersView = columnHeadersModule.views.columnHeadersView;

gridCore.registerModule('columnHeaders', columnHeadersModule);
