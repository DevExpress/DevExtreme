import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/series_family.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizSeriesFamily');

export const SeriesFamily = wrapCtor(api, 'SeriesFamily');
export default api;
