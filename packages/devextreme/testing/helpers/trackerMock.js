const vizMocks = require('./vizMocks.js');
// Mutate the import-map facade (see esm-shims/viz_chart_tracker.js).
const trackerModule = require('viz/chart_components/tracker');

const ChartTrackerStub = vizMocks.stubClass(trackerModule.ChartTracker);
const PieTrackerStub = vizMocks.stubClass(trackerModule.PieTracker);

trackerModule.ChartTracker = sinon.spy((parameters) => new ChartTrackerStub(parameters));
trackerModule.PieTracker = sinon.spy((parameters) => new PieTrackerStub(parameters));

exports.default = trackerModule;
exports.__esModule = true;

exports.ChartTracker = trackerModule.ChartTracker;
exports.PieTracker = trackerModule.PieTracker;
