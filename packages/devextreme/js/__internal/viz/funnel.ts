import { plugin as pluginLegend } from '@ts/viz/components/legend';
import { plugin as pluginExport } from '@ts/viz/core/export';
import { plugin as pluginLoadingIndicator } from '@ts/viz/core/loading_indicator';
import { plugin as pluginTitle } from '@ts/viz/core/title';
import dxFunnel from '@ts/viz/funnel/funnel';
import { plugin as pluginLabel } from '@ts/viz/funnel/label';
import { plugin as pluginTooltip } from '@ts/viz/funnel/tooltip';
import { plugin as pluginTracker } from '@ts/viz/funnel/tracker';

dxFunnel.addPlugin(pluginLabel);
dxFunnel.addPlugin(pluginExport);
dxFunnel.addPlugin(pluginTitle);
dxFunnel.addPlugin(pluginLegend);
dxFunnel.addPlugin(pluginTracker);
dxFunnel.addPlugin(pluginTooltip);
dxFunnel.addPlugin(pluginLoadingIndicator);

export default dxFunnel;
