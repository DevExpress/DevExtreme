import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/data_exchanger.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizDataExchanger');

export const DataExchanger = wrapCtor(api, 'DataExchanger');
export default api;
