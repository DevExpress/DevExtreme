var testGlobalExports = require('../../helpers/publicModulesHelper.js'),
    AdvancedChartModule = require('viz/chart_components/advanced_chart'),
    baseChartModule = require('viz/chart_components/base_chart'),
    CrosshairModule = require('viz/chart_components/crosshair'),
    LayoutManagerModule = require('viz/chart_components/layout_manager'),
    multiAxesSynchronizer = require('viz/chart_components/multi_axes_synchronizer'),
    ScrollBarModule = require('viz/chart_components/scroll_bar'),
    trackerModule = require('viz/chart_components/tracker');

require('viz/chart');
require('viz/pie_chart');
require('viz/polar_chart');

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
