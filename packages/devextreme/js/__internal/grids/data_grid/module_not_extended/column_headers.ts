import { columnHeadersModule } from '@ts/grids/grid_core/column_headers/m_column_headers';

import gridCore from '../m_core';

export const ColumnHeadersView = columnHeadersModule.views.columnHeadersView;

gridCore.registerModule('columnHeaders', columnHeadersModule);
