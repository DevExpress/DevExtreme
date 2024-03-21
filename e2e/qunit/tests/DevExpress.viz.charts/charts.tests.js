const testGlobalExports = require('../../helpers/publicModulesHelper.js');
const AdvancedChartModule = require('__internal/viz/chart_components/m_advanced_chart');
const baseChartModule = require('__internal/viz/chart_components/m_base_chart');
const CrosshairModule = require('viz/chart_components/crosshair');
const LayoutManagerModule = require('viz/chart_components/layout_manager');
const multiAxesSynchronizer = require('viz/chart_components/multi_axes_synchronizer');
const ScrollBarModule = require('viz/chart_components/scroll_bar');
const trackerModule = require('viz/chart_components/tracker');

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
