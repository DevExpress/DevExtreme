import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/legend.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizLegend');

export const LegendsControl = wrapCtor(api, 'LegendsControl');
export const _TESTS_Legend = wrapCtor(api, '_TESTS_Legend');
export default api;
