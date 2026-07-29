/**
 * Mutable facade for ui/widget/ui.errors (`sinon.spy(uiErrors, 'log')`).
 */
import original from '../../../artifacts/transpiled-esm-npm/esm/ui/widget/ui.errors.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi({ ...original }, '__dxMutableUiErrors');

export const log = wrapCtor(api, 'log');
export const Error = wrapCtor(api, 'Error');
export default api;
