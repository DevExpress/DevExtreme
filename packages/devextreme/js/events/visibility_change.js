import { triggerVisibilityChangeEvent } from '../__internal/events/visibility_change';

export const triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export const triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');
