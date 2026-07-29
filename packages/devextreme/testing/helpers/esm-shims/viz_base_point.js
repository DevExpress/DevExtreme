import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/series/points/base_point.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizBasePoint');

export const Point = wrapCtor(api, 'Point');
export default api;
