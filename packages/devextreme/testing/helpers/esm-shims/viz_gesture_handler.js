import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/gesture_handler.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizGestureHandler');

export const GestureHandler = wrapCtor(api, 'GestureHandler');
export default api;
