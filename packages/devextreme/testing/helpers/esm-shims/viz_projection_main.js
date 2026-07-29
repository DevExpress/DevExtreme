import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/projection.main.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizProjectionMain');

export const Projection = wrapCtor(api, 'Projection');
export const projection = original.projection;
export const _TESTS_Engine = original._TESTS_Engine;
export default api;
