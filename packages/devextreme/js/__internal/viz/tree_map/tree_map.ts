import '@ts/viz/tree_map/tiling.squarified';
import '@ts/viz/tree_map/tiling.strip';
import '@ts/viz/tree_map/tiling.slice_and_dice';
import '@ts/viz/tree_map/tiling.rotated_slice_and_dice';
import '@ts/viz/tree_map/colorizing.discrete';
import '@ts/viz/tree_map/colorizing.gradient';
import '@ts/viz/tree_map/colorizing.range';
import '@ts/viz/tree_map/api';
import '@ts/viz/tree_map/hover';
import '@ts/viz/tree_map/selection';
import '@ts/viz/tree_map/tooltip';
import '@ts/viz/tree_map/tracker';
import '@ts/viz/tree_map/drilldown';
import '@ts/viz/tree_map/plain_data_source';

// PLUGINS_SECTION
import { plugin as pluginExport } from '@ts/viz/core/export';
import { plugin as pluginLoadIndicator } from '@ts/viz/core/loading_indicator';
import { plugin as pluginTitle } from '@ts/viz/core/title';
import dxTreeMap from '@ts/viz/tree_map/tree_map.base';

export default dxTreeMap;

dxTreeMap.addPlugin(pluginExport);
dxTreeMap.addPlugin(pluginTitle);
dxTreeMap.addPlugin(pluginLoadIndicator);
