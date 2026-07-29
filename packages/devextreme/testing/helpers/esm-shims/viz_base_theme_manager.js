import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/base_theme_manager.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizBaseThemeManager');

export const BaseThemeManager = wrapCtor(api, 'BaseThemeManager');
export default api;
