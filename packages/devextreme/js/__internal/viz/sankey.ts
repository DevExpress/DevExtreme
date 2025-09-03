import { plugin as pluginExport } from '@ts/viz/core/export';
import { plugin as pluginLoadingIndicator } from '@ts/viz/core/loading_indicator';
import { plugin as pluginTitle } from '@ts/viz/core/title';
import { plugin as pluginTooltip } from '@ts/viz/core/tooltip';
import dxSankey from '@ts/viz/sankey/sankey';
import { setTooltipCustomOptions } from '@ts/viz/sankey/tooltip';
import { plugin as pluginTracker } from '@ts/viz/sankey/tracker';

dxSankey.addPlugin(pluginExport);
dxSankey.addPlugin(pluginTitle);
dxSankey.addPlugin(pluginTracker);
dxSankey.addPlugin(pluginLoadingIndicator);
dxSankey.addPlugin(pluginTooltip);
setTooltipCustomOptions(dxSankey);

export default dxSankey;
