/**
 * Mutable facade for ui/themes — QUnit stubs replace api.isMaterial / isFluent /
 * isMaterialBased / isGeneric / current on the default export object.
 *
 * Named exports always forward to the current api.* implementation so
 * library `import { isMaterial }` keeps working after stubs.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/ui/themes.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableUiThemes';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = {
    ...original,
    // Keep composition live so stubbing isMaterial / isFluent affects isMaterialBased.
    isMaterialBased(themeName) {
        return api.isMaterial(themeName) || api.isFluent(themeName);
    },
});

function wrapExport(name) {
    return function(...args) {
        return api[name](...args);
    };
}

export const setDefaultTimeout = wrapExport('setDefaultTimeout');
export const init = wrapExport('init');
export const initialized = wrapExport('initialized');
export const resetTheme = wrapExport('resetTheme');
export const ready = wrapExport('ready');
export const waitWebFont = wrapExport('waitWebFont');
export const isWebFontLoaded = wrapExport('isWebFontLoaded');
export const isCompact = wrapExport('isCompact');
export const isDark = wrapExport('isDark');
export const isGeneric = wrapExport('isGeneric');
export const isMaterial = wrapExport('isMaterial');
export const isFluent = wrapExport('isFluent');
export const isMaterialBased = wrapExport('isMaterialBased');
export const detachCssClasses = wrapExport('detachCssClasses');
export const attachCssClasses = wrapExport('attachCssClasses');
export const current = wrapExport('current');
export const waitForThemeLoad = wrapExport('waitForThemeLoad');
export const isPendingThemeLoaded = wrapExport('isPendingThemeLoaded');

export default api;
