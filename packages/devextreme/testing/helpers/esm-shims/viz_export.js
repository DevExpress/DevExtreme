import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/export.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizExport', {
    DEBUG_set_ExportMenu: 'ExportMenu',
    DEBUG_set_combineMarkups: 'combineMarkups',
});

export const exportFromMarkup = wrapCtor(api, 'exportFromMarkup');
export const getMarkup = wrapCtor(api, 'getMarkup');
export const exportWidgets = wrapCtor(api, 'exportWidgets');
export const combineMarkups = wrapCtor(api, 'combineMarkups');
export const ExportMenu = wrapCtor(api, 'ExportMenu');
export const plugin = original.plugin;
export const DEBUG_set_ExportMenu = api.DEBUG_set_ExportMenu;
export const DEBUG_set_combineMarkups = api.DEBUG_set_combineMarkups;
export default api;
