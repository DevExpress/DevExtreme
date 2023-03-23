import data from './data';
import ui from './widgets-base';

/// BUNDLER_PARTS
/* Web widgets (dx.module-widgets-web.js) */

ui.dxAccordion = import('../../../ui/accordion');
ui.dxContextMenu = import('../../../ui/context_menu');
ui.dxDataGrid = import('../../../ui/data_grid');
ui.dxTreeList = import('../../../ui/tree_list');
ui.dxMenu = import('../../../ui/menu');
ui.dxPivotGrid = import('../../../ui/pivot_grid');
ui.dxPivotGridFieldChooser = import('../../../ui/pivot_grid_field_chooser');
data.PivotGridDataSource = import('../../../ui/pivot_grid/data_source');
data.XmlaStore = import('../../../ui/pivot_grid/xmla_store');
ui.dxScheduler = import('../../../ui/scheduler');
ui.dxTreeView = import('../../../ui/tree_view');
ui.dxFilterBuilder = import('../../../ui/filter_builder');
ui.dxFileManager = import('../../../ui/file_manager');
ui.dxDiagram = import('../../../ui/diagram');
ui.dxGantt = import('../../../ui/gantt');
/// BUNDLER_PARTS_END
