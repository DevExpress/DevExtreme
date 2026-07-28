/**
 * Mutable facade for tooltip module — QUnit tests override api.Tooltip
 * while named `import { Tooltip }` keeps delegating to current impl.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/tooltip.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizTooltip';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

export const Tooltip = function(...args) {
    const Impl = api.Tooltip;
    if(new.target) {
        return new Impl(...args);
    }
    return Impl.apply(this, args);
};

export const plugin = api.plugin;

export default api;
