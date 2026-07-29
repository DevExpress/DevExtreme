import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/layout_manager.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizLayoutManager');

export const LayoutManager = wrapCtor(api, 'LayoutManager');
export default api;
