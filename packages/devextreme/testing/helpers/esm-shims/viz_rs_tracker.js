/**
 * Mutable facade for viz/range_selector/tracker.
 * Public entry is `export default` of `import * as` (frozen Module).
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/range_selector/tracker.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizRsTracker');

export const Tracker = wrapCtor(api, 'Tracker');
export default api;
