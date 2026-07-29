import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/crosshair.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizCrosshair');

export const Crosshair = wrapCtor(api, 'Crosshair');
export const getMargins = wrapCtor(api, 'getMargins');
export default api;
