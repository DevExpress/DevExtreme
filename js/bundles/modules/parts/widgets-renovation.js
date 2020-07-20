/* eslint-disable import/no-commonjs */

/// BUNDLER_PARTS
/* Renovation (dx.module-renovation.js) */

const renovation = require('../../../bundles/modules/renovation');
renovation.dxrButton = require('../../../renovation/button.j').default;
renovation.dxrCheckBox = require('../../../renovation/check_box.j').default;
renovation.dxrWidget = require('../../../renovation/common/widget.j').default;
renovation.dxrGridPager = require('../../../renovation/pager/grid_pager.j').default;
renovation.dxrDataGrid = require('../../../renovation/data_grid/data_grid.j').default;
renovation.dxrTooltipItemLayout = require('../../../renovation/scheduler/appointment_tooltip/item_layout.j').default;
/// BUNDLER_PARTS_END
module.exports = renovation;
