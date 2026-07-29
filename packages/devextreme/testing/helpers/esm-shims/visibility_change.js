/**
 * Mutable facade for visibility_change.
 * Named exports are snapshots of functions; spies on `default.triggerResizeEvent`
 * would not affect `import { triggerResizeEvent }`. Forward named via wrapCtor.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/events/m_visibility_change.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original.default ?? original, '__dxMutableVisibilityChange');

export const triggerShownEvent = wrapCtor(api, 'triggerShownEvent');
export const triggerHidingEvent = wrapCtor(api, 'triggerHidingEvent');
export const triggerResizeEvent = wrapCtor(api, 'triggerResizeEvent');
export default api;
