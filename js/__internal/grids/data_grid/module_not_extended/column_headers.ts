// @ts-expect-error
import { columnHeadersModule } from '@js/ui/grid_core/ui.grid_core.column_headers';
import gridCore from '../module_core';

export const ColumnHeadersView = columnHeadersModule.views.columnHeadersView;

gridCore.registerModule('columnHeaders', columnHeadersModule);
