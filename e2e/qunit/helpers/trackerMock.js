const mock = require('./mockModule.js').mock;
const vizMocks = require('./vizMocks.js');
const { ChartTracker, PieTracker } = require('viz/chart_components/tracker');
const ChartTrackerStub = vizMocks.stubClass(ChartTracker);
const PieTrackerStub = vizMocks.stubClass(PieTracker);

const trackerModule = mock('viz/chart_components/tracker', {
    ChartTracker: sinon.spy((parameters) => new ChartTrackerStub(parameters)),
    PieTracker: sinon.spy((parameters) => new PieTrackerStub(parameters))
});

exports.default = trackerModule;
exports.__esModule = true;

exports.ChartTracker = trackerModule.ChartTracker;
exports.PieTracker = trackerModule.PieTracker;
