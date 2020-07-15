/* eslint-disable import/no-commonjs */

/// BUNDLER_PARTS
/* Renovation (dx.module-renovation.js) */

const renovation = require('../../../bundles/modules/renovation');
renovation.dxrButton = require('../../../renovation/button.j').default;
renovation.dxrWidget = require('../../../renovation/widget.j').default;
renovation.dxrGridPager = require('../../../renovation/pager/grid_pager.j').default;
renovation.dxrTooltipItemLayout = require('../../../renovation/scheduler/appointment-tooltip/item-layout.j').default;
/// BUNDLER_PARTS_END
module.exports = renovation;
