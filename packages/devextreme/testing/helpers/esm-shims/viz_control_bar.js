import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/control_bar/control_bar.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizControlBar');

export const ControlBar = wrapCtor(api, 'ControlBar');
export default api;
