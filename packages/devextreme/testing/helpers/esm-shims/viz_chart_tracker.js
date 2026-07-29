import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/tracker.js?dx-original=1';
import { createMutableApi } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizChartTracker');

// Live bindings so `import { ChartTracker }` tracks facade mutations
// (trackerMock replaces these with sinon spies; SystemJS used to expose the
// same object as both default props and named exports).
export let ChartTracker = api.ChartTracker;
export let PieTracker = api.PieTracker;

Object.defineProperty(api, 'ChartTracker', {
    get() { return ChartTracker; },
    set(value) { ChartTracker = value; },
    enumerable: true,
    configurable: true,
});
Object.defineProperty(api, 'PieTracker', {
    get() { return PieTracker; },
    set(value) { PieTracker = value; },
    enumerable: true,
    configurable: true,
});

export default api;
