"use strict";

var DevExpress = require("./core");
require("./data");

/// BUNDLER_PARTS
/* Viz core (dx.module-viz-core.js) */

var viz = DevExpress.viz = require("../../../bundles/modules/viz");
viz.currentTheme = require("../../../viz/themes").currentTheme;
viz.registerTheme = require("../../../viz/themes").registerTheme;
viz.exportFromMarkup = require("../../../viz/export").exportFromMarkup;
viz.getMarkup = require("../../../viz/export").getMarkup;
viz.currentPalette = require("../../../viz/palette").currentPalette;
viz.getPalette = require("../../../viz/palette").getPalette;
viz.registerPalette = require("../../../viz/palette").registerPalette;
viz.refreshTheme = require("../../../viz/themes").refreshTheme;

/* Charts (dx.module-viz-charts.js) */
viz.dxChart = require("../../../viz/chart");
viz.dxPieChart = require("../../../viz/pie_chart");
viz.dxPolarChart = require("../../../viz/polar_chart");

/* Gauges (dx.module-viz-gauges.js) */
viz.dxLinearGauge = require("../../../viz/linear_gauge");
viz.dxCircularGauge = require("../../../viz/circular_gauge");
viz.dxBarGauge = require("../../../viz/bar_gauge");

/* Range selector (dx.module-viz-rangeselector.js) */
viz.dxRangeSelector = require("../../../viz/range_selector");

/* Vector map (dx.module-viz-vectormap.js) */
viz.dxVectorMap = require("../../../viz/vector_map");
viz.map = {};
viz.map.sources = {};
viz.map.projection = require("../../../viz/vector_map/projection").projection;

/* Sparklines (dx.module-viz-sparklines.js) */
viz.dxSparkline = require("../../../viz/sparkline");
viz.dxBullet = require("../../../viz/bullet");

/* Treemap */
viz.dxTreeMap = require("../../../viz/tree_map");

/* Funnel */
viz.dxFunnel = require("../../../viz/funnel");

/* Sankey */
viz.dxSankey = require("../../../viz/sankey");

/// BUNDLER_PARTS_END

viz.BaseWidget = require("../../../viz/core/base_widget");

viz.getTheme = require("../../../viz/themes").getTheme;
// Keep it for backward compatibility after renaming findTheme to getTheme
viz.findTheme = require("../../../viz/themes").getTheme;
// We need to keep this method as we suggested it to users
viz.refreshAll = require("../../../viz/themes").refreshTheme;

viz.refreshPaths = require("../../../viz/utils").refreshPaths;

viz.gauges = { __internals: {} };

viz._dashboard = {};
viz._dashboard.Renderer = require("../../../viz/core/renderers/renderer").Renderer;
viz._dashboard.SvgElement = require("../../../viz/core/renderers/renderer").SvgElement;
viz._dashboard.patchFontOptions = require("../../../viz/core/utils").patchFontOptions;

module.exports = viz;
