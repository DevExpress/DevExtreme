import dxSankey from './sankey/sankey';
import { setTooltipCustomOptions } from './sankey/tooltip';

import { plugin as pluginExport } from './core/export';
import { plugin as pluginTitle } from './core/title';
import { plugin as pluginTracker } from './sankey/tracker';
import { plugin as pluginTooltip } from './core/tooltip';
import { plugin as pluginLoadingIndicator } from './core/loading_indicator';

dxSankey.addPlugin(pluginExport);
dxSankey.addPlugin(pluginTitle);
dxSankey.addPlugin(pluginTracker);
dxSankey.addPlugin(pluginLoadingIndicator);
dxSankey.addPlugin(pluginTooltip);
setTooltipCustomOptions(dxSankey);

export default dxSankey;
