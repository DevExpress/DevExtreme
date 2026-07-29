/**
 * Mutable facade for viz/translators/range.
 * Public entry is `export default` of `import * as` (frozen Module).
 * Chart/gauge QUnit: `sinon.stub(rangeModule, 'Range')`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/translators/range.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizRange');

export const Range = wrapCtor(api, 'Range');
export default api;
