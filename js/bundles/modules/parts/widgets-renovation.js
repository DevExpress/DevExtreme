/* eslint-disable import/no-commonjs */

/// BUNDLER_PARTS
/* Renovation (dx.module-renovation.js) */

const renovation = require('../../../bundles/modules/renovation');
renovation.dxButton = require('../../../renovation/ui/button.j').default;
renovation.dxCheckBox = require('../../../renovation/ui/check_box.j').default;
renovation.dxWidget = require('../../../renovation/ui/common/widget.j').default;
renovation.dxGridPager = require('../../../renovation/ui/pager/grid_pager.j').default;
renovation.dxDataGrid = require('../../../renovation/ui/data_grid/data_grid.j').default;
renovation.dxTooltipItemLayout = require('../../../renovation/ui/scheduler/appointment_tooltip/item_layout.j').default;
/// BUNDLER_PARTS_END
module.exports = renovation;
