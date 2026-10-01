import { columnsResizingReorderingModule } from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';

import gridCore from '../core';

const { views, controllers } = columnsResizingReorderingModule;

export const DraggingHeaderView = views.draggingHeaderView;
export const DraggingHeaderViewController = controllers.draggingHeader;
export const ColumnsSeparatorView = views.columnsSeparatorView;
export const TablePositionViewController = controllers.tablePosition;
export const ColumnsResizerViewController = controllers.columnsResizer;
export const TrackerView = views.trackerView;

gridCore.registerModule('columnsResizingReordering', columnsResizingReorderingModule);

// NOTE: default export for QUnit tests
export default {
  DraggingHeaderView,
  DraggingHeaderViewController,
  ColumnsSeparatorView,
  TablePositionViewController,
  ColumnsResizerViewController,
  TrackerView,
};
