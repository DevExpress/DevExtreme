import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/components/data_validator.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizDataValidator');

export const validateData = wrapCtor(api, 'validateData');
export default api;
