import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/title.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizTitle', {
    DEBUG_set_title: 'Title',
});

export const Title = wrapCtor(api, 'Title');
export const plugin = original.plugin;
export const DEBUG_set_title = api.DEBUG_set_title;
export default api;
