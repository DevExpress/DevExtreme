/**
 * Mutable facade for Translator2D — QUnit stubs replace api.Translator2D
 * while named `import { Translator2D }` keeps delegating to the current impl.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/translators/translator2d.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizTranslator2d';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

export const Translator2D = function(...args) {
    const Impl = api.Translator2D;
    if(new.target) {
        return new Impl(...args);
    }
    return Impl.apply(this, args);
};

export default api;
