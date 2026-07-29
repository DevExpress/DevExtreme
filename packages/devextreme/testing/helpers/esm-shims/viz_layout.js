import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/layout.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizLayout');

export const LayoutControl = wrapCtor(api, 'LayoutControl');
export default api;
