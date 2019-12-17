var dxTreeMap = module.exports = require('./tree_map.base');

require('./tiling.squarified');
require('./tiling.strip');
require('./tiling.slice_and_dice');
require('./tiling.rotated_slice_and_dice');

require('./colorizing.discrete');
require('./colorizing.gradient');
require('./colorizing.range');

require('./api');
require('./hover');
require('./selection');
require('./tooltip');
require('./tracker');
require('./drilldown');
require('./plain_data_source');

// PLUGINS_SECTION
dxTreeMap.addPlugin(require('../core/export').plugin);
dxTreeMap.addPlugin(require('../core/title').plugin);
dxTreeMap.addPlugin(require('../core/loading_indicator').plugin);
