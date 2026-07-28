/**
 * Mutable facade for viz/components/legend.
 * Public entry is `export default` of the ESM namespace — sinon cannot stub that.
 * Chart QUnit (commons.js) does `sinon.stub(legendModule, 'Legend')`.
 * Named `Legend` forwards to api.Legend so m_base_chart keeps working after stub.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/components/legend.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizComponentsLegend');

export const Legend = wrapCtor(api, 'Legend');
export const plugin = original.plugin;

export function _setLegend(value) {
    api.Legend = value;
    if(typeof original._setLegend === 'function') {
        original._setLegend(value);
    }
}

api._setLegend = _setLegend;

export const _DEBUG_stubMarkerCreator = original._DEBUG_stubMarkerCreator;
export const _DEBUG_restoreMarkerCreator = original._DEBUG_restoreMarkerCreator;

export default api;
