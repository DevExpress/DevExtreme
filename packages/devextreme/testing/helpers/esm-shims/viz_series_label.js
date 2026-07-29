/**
 * Mutable facade for viz/series/points/label.
 * Public entry is `export default` of `import * as` (frozen Module).
 * Funnel/series QUnit: `sinon.stub(labelModule, 'Label')`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/series/points/label.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizSeriesLabel');

export const Label = wrapCtor(api, 'Label');
export default api;
