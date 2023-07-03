import { rowsModule } from '@ts/grids/grid_core/views/m_rows_view';

import gridCore from '../m_core';

export const RowsView = rowsModule.views.rowsView;

gridCore.registerModule('rows', rowsModule);
