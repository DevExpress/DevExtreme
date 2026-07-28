const vizMocks = require('./vizMocks.js');
// Mutable ESM facade (see esm-shims/viz_chart_tracker.js). Under SystemJS this
// used mockModule/System.set; native ESM has no module registry to replace.
const trackerModule = require('viz/chart_components/tracker');

const ChartTrackerStub = vizMocks.stubClass(trackerModule.ChartTracker);
const PieTrackerStub = vizMocks.stubClass(trackerModule.PieTracker);

trackerModule.ChartTracker = sinon.spy((parameters) => new ChartTrackerStub(parameters));
trackerModule.PieTracker = sinon.spy((parameters) => new PieTrackerStub(parameters));

exports.default = trackerModule;
exports.__esModule = true;

exports.ChartTracker = trackerModule.ChartTracker;
exports.PieTracker = trackerModule.PieTracker;
