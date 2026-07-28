/**
 * Mutable facade for viz renderer — QUnit stubs replace api.Renderer etc.
 * Named exports always forward to the current api.* implementation so
 * library `import { Renderer }` keeps working after stubs.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/renderers/renderer.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizRenderer';

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

export const getBackup = original.getBackup;
export const getFuncIri = wrapExport('getFuncIri');
export const processHatchingAttrs = wrapExport('processHatchingAttrs');
export const SvgElement = wrapExport('SvgElement');
export const PathSvgElement = wrapExport('PathSvgElement');
export const ArcSvgElement = wrapExport('ArcSvgElement');
export const RectSvgElement = wrapExport('RectSvgElement');
export const TextSvgElement = wrapExport('TextSvgElement');
export const Renderer = wrapExport('Renderer');
export const refreshPaths = wrapExport('refreshPaths');

export default api;
