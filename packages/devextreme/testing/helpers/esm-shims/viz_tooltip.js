/**
 * Mutable facade for tooltip module — QUnit tests override api.Tooltip
 * while named `import { Tooltip }` keeps delegating to current impl.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/tooltip.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizTooltip', {
    DEBUG_set_tooltip: 'Tooltip',
});

export const Tooltip = wrapCtor(api, 'Tooltip');
export const plugin = original.plugin;
export const DEBUG_set_tooltip = api.DEBUG_set_tooltip;
export default api;
