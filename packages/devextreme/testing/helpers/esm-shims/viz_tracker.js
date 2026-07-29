import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/tracker.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizTracker');

export const Tracker = wrapCtor(api, 'Tracker');
export const Focus = wrapCtor(api, 'Focus');
export default api;
