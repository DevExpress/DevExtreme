/**
 * Mutable facade for viz/core/plaque.
 * Public entry is `export default` of `import * as` (frozen Module).
 * VectorMap QUnit: `sinon.stub(plaqueModule, 'Plaque')`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/plaque.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizPlaque');

export const Plaque = wrapCtor(api, 'Plaque');
export default api;
