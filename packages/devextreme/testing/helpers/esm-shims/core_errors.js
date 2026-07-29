/**
 * Mutable facade for core/errors (`sinon.spy(errors, 'log')`).
 */
import original from '../../../artifacts/transpiled-esm-npm/esm/core/errors.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi({ ...original }, '__dxMutableCoreErrors');

export const log = wrapCtor(api, 'log');
export default api;
