const data = require('./data');
const ui = require('./widgets-base');

/// BUNDLER_PARTS
/* Web widgets (dx.module-widgets-web.js) */

ui.dxAccordion = require('../../../ui/accordion');
ui.dxContextMenu = require('../../../ui/context_menu');
ui.dxDataGrid = require('../../../ui/data_grid');
ui.dxTreeList = require('../../../ui/tree_list');
ui.dxMenu = require('../../../ui/menu');
ui.dxPivotGrid = require('../../../ui/pivot_grid');
ui.dxPivotGridFieldChooser = require('../../../ui/pivot_grid_field_chooser');
data.PivotGridDataSource = require('../../../ui/pivot_grid/data_source');
data.XmlaStore = require('../../../ui/pivot_grid/xmla_store');
ui.dxScheduler = require('../../../ui/scheduler');
ui.dxTreeView = require('../../../ui/tree_view');
ui.dxFilterBuilder = require('../../../ui/filter_builder');
ui.dxFileManager = require('../../../ui/file_manager');
ui.dxDiagram = require('../../../ui/diagram');
ui.dxGantt = require('../../../ui/gantt');
/// BUNDLER_PARTS_END
