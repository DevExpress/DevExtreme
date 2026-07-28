/**
 * Mutable facade for paletteModule — QUnit tests spy/stub api.createPalette.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/palette.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizPaletteModule';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

export const currentPalette = function(...args) {
    return api.currentPalette(...args);
};
export const generateColors = function(...args) {
    return api.generateColors(...args);
};
export const getPalette = function(...args) {
    return api.getPalette(...args);
};
export const registerPalette = function(...args) {
    return api.registerPalette(...args);
};
export const getAccentColor = function(...args) {
    return api.getAccentColor(...args);
};
export const createPalette = function(...args) {
    return api.createPalette(...args);
};
export const getDiscretePalette = function(...args) {
    return api.getDiscretePalette(...args);
};
export const getGradientPalette = function(...args) {
    return api.getGradientPalette(...args);
};

export default api;
