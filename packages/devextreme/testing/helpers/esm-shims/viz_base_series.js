import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/series/base_series.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizBaseSeries');

export const Series = wrapCtor(api, 'Series');
export const mixins = original.mixins;
export default api;
