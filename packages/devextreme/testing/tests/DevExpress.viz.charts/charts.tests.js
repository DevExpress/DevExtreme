import testGlobalExports from '../../helpers/publicModulesHelper.js';
import * as AdvancedChartModule from '__internal/viz/chart_components/m_advanced_chart';
import * as baseChartModule from '__internal/viz/chart_components/m_base_chart';
import * as CrosshairModule from 'viz/chart_components/crosshair';
import * as LayoutManagerModule from 'viz/chart_components/layout_manager';
import * as multiAxesSynchronizer from 'viz/chart_components/multi_axes_synchronizer';
import * as ScrollBarModule from 'viz/chart_components/scroll_bar';
import * as trackerModule from 'viz/chart_components/tracker';

import 'viz/chart';
import 'viz/pie_chart';
import 'viz/polar_chart';

testGlobalExports({
    'AdvancedChart module': AdvancedChartModule
}, {
    'AdvancedChart': AdvancedChartModule.AdvancedChart
});

testGlobalExports({
    'baseChart module': baseChartModule
}, {
    'overlapping': baseChartModule.overlapping,
    'BaseChart': baseChartModule.BaseChart
});

testGlobalExports({
    'Crosshair module': CrosshairModule
}, {
    'Crosshair': CrosshairModule.Crosshair
});

testGlobalExports({
    'LayoutManager module': LayoutManagerModule
}, {
    'LayoutManager': LayoutManagerModule.LayoutManager
});

testGlobalExports({
    'multiAxesSynchronizer module': multiAxesSynchronizer
}, {
    'synchronize': multiAxesSynchronizer.synchronize
});

testGlobalExports({
    'ScrollBar module': ScrollBarModule
}, {
    'ScrollBar': ScrollBarModule.ScrollBar
});

testGlobalExports({
    'tracker module': trackerModule
}, {
    'ChartTracker': trackerModule.ChartTracker,
    'PieTracker': trackerModule.PieTracker
});
