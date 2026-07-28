/**
 * Mutable facade for Axis — QUnit stubs replace api.Axis while named
 * `import { Axis }` keeps delegating to the current implementation.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/axes/base_axis.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizBaseAxis';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

export const Axis = function(...args) {
    const Impl = api.Axis;
    if(new.target) {
        return new Impl(...args);
    }
    return Impl.apply(this, args);
};

export default api;
