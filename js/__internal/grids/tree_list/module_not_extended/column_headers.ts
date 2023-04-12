// @ts-expect-error
import { columnHeadersModule } from '@js/ui/grid_core/ui.grid_core.column_headers';
import treeListCore from '../module_core';

treeListCore.registerModule('columnHeaders', columnHeadersModule);
