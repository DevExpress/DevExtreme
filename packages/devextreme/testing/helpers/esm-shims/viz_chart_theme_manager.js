import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/components/chart_theme_manager.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizChartThemeManager');

export const ThemeManager = wrapCtor(api, 'ThemeManager');
export default api;
