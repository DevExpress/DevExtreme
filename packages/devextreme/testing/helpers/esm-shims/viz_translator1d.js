/**
 * Mutable facade for viz/translators/translator1d.
 * Public entry is `export default` of `import * as` (frozen Module).
 * Gauge/pie QUnit: `sinon.stub(translator1DModule, 'Translator1D')`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/translators/translator1d.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizTranslator1D');

export const Translator1D = wrapCtor(api, 'Translator1D');
export default api;
