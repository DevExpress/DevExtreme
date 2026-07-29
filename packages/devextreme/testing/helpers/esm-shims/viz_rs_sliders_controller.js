/**
 * Mutable facade for viz/range_selector/sliders_controller.
 * Public entry is `export default` of `import * as` (frozen Module).
 * RangeSelector QUnit: assigns / spies `slidersControllerModule.SlidersController`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/range_selector/sliders_controller.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizRsSlidersController');

export const SlidersController = wrapCtor(api, 'SlidersController');
export default api;
