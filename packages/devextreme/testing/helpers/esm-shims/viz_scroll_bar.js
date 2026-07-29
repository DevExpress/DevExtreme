import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/scroll_bar.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizScrollBar');

export const ScrollBar = wrapCtor(api, 'ScrollBar');
export default api;
