import { columnsResizingReorderingModule } from '@js/ui/grid_core/ui.grid_core.columns_resizing_reordering';
import gridCore from '../module_core';

export const DraggingHeaderView = columnsResizingReorderingModule.views.draggingHeaderView;
export const DraggingHeaderViewController = columnsResizingReorderingModule.controllers.draggingHeader;
export const ColumnsSeparatorView = columnsResizingReorderingModule.views.columnsSeparatorView;
export const TablePositionViewController = columnsResizingReorderingModule.controllers.tablePosition;
export const ColumnsResizerViewController = columnsResizingReorderingModule.controllers.columnsResizer;
export const TrackerView = columnsResizingReorderingModule.views.trackerView;

gridCore.registerModule('columnsResizingReordering', columnsResizingReorderingModule);
