/**
 * Mutable facade for common/core/animation/frame — QUnit stubs replace
 * api.requestAnimationFrame / cancelAnimationFrame on the default export.
 *
 * Named exports always forward to the current api.* implementation so
 * library `import { requestAnimationFrame }` keeps working after stubs.
 *
 * Does not modify packages/devextreme/js — wraps the real frame module via
 * ?dx-original=1. api is on globalThis so import-map and static-redirect URLs
 * share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/common/core/animation/frame.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableAnimationFrame';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = {
    requestAnimationFrame(...args) {
        return original.requestAnimationFrame(...args);
    },
    cancelAnimationFrame(...args) {
        return original.cancelAnimationFrame(...args);
    },
});

export function requestAnimationFrame(...args) {
    return api.requestAnimationFrame(...args);
}

export function cancelAnimationFrame(...args) {
    return api.cancelAnimationFrame(...args);
}

export default api;
