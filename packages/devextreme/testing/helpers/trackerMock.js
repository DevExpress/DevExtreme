import { stubClass } from './vizMocks.js';
// Mutate the import-map facade (see esm-shims/viz_chart_tracker.js).
import trackerModule from 'viz/chart_components/tracker';

const ChartTrackerStub = stubClass(trackerModule.ChartTracker);
const PieTrackerStub = stubClass(trackerModule.PieTracker);

trackerModule.ChartTracker = sinon.spy((parameters) => new ChartTrackerStub(parameters));
trackerModule.PieTracker = sinon.spy((parameters) => new PieTrackerStub(parameters));

export default trackerModule;

export const ChartTracker = trackerModule.ChartTracker;
export const PieTracker = trackerModule.PieTracker;
