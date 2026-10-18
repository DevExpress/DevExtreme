import { rowsModule } from '@ts/grids/grid_core/views/rows_view';

import gridCore from '../core';

export const RowsView = rowsModule.views.rowsView;

gridCore.registerModule('rows', rowsModule);
