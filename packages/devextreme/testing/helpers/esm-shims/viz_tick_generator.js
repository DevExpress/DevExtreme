/**
 * Mutable facade for tickGenerator — QUnit stubs replace api.tickGenerator
 * while named `import { tickGenerator }` keeps delegating to current impl.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/axes/tick_generator.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizTickGenerator';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

export const tickGenerator = function(...args) {
    return api.tickGenerator(...args);
};

export default api;
