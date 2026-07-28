/**
 * Mutable facade for viz renderer animation — QUnit stubs replace
 * api.AnimationController on the default export object.
 *
 * Named exports always forward to the current api.* implementation so
 * library `import { AnimationController }` keeps working after stubs.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/renderers/animation.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizAnimation';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

function wrapExport(name) {
    const ExportWrapper = function(...args) {
        const Impl = api[name];
        if(new.target) {
            return new Impl(...args);
        }
        return Impl.apply(this, args);
    };
    Object.defineProperty(ExportWrapper, 'name', { value: name, configurable: true });
    return ExportWrapper;
}

export const noop = wrapExport('noop');
export const easingFunctions = original.easingFunctions;
export const animationSvgStep = original.animationSvgStep;
export const Animation = wrapExport('Animation');
export const AnimationController = wrapExport('AnimationController');

export default api;
