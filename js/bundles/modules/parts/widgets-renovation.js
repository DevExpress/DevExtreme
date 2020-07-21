/* eslint-disable import/no-commonjs */

/// BUNDLER_PARTS
/* Renovation (dx.module-renovation.js) */

const renovation = require('../../../bundles/modules/renovation');
renovation.dxrButton = require('../../../renovation/ui/button.j').default;
renovation.dxrWidget = require('../../../renovation/ui/common/widget.j').default;
renovation.dxrGridPager = require('../../../renovation/pager/grid_pager.j').default;
renovation.dxrDataGrid = require('../../../renovation/data_grid/data_grid.j').default;
renovation.dxrDayDateTableLayout = require('../../../renovation/ui/scheduler/workspaces/day/date_table/layout.j').default;
renovation.dxrTimePanelTableLayout = require('../../../renovation/ui/scheduler/workspaces/base/time_panel/layout.j').default;
renovation.dxrTooltipItemLayout = require('../../../renovation/ui/scheduler/appointment_tooltip/item_layout.j').default;
/// BUNDLER_PARTS_END
module.exports = renovation;
