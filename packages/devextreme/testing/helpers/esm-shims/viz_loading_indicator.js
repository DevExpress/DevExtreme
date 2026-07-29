import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/loading_indicator.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizLoadingIndicator', {
    DEBUG_set_LoadingIndicator: 'LoadingIndicator',
});

export const LoadingIndicator = wrapCtor(api, 'LoadingIndicator');
export const plugin = original.plugin;
export const DEBUG_set_LoadingIndicator = api.DEBUG_set_LoadingIndicator;
export default api;
