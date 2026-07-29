/**
 * Mutable facade for Axis — QUnit stubs replace api.Axis while named
 * `import { Axis }` keeps delegating to the current implementation.
 *
 * Must keep ExportWrapper.prototype === Impl.prototype so callers that
 * iterate Axis.prototype (e.g. range_selector AxisWrapper method copy)
 * still see dispose / update / …
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/axes/base_axis.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizBaseAxis');

export const Axis = wrapCtor(api, 'Axis');
export default api;
