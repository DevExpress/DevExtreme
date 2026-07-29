import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/tooltip_viewer.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizTooltipViewer');

export const TooltipViewer = wrapCtor(api, 'TooltipViewer');
export default api;
