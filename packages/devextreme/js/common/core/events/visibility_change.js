import VisibilityChangeModule from '../../../__internal/events/visibility_change';

// eslint-disable-next-line import/no-mutable-exports -- test seam for QUnit stubs
export let triggerShownEvent = VisibilityChangeModule.triggerShownEvent;
// eslint-disable-next-line import/no-mutable-exports -- test seam for QUnit stubs
export let triggerHidingEvent = VisibilityChangeModule.triggerHidingEvent;
// eslint-disable-next-line import/no-mutable-exports -- test seam for QUnit stubs
export let triggerResizeEvent = VisibilityChangeModule.triggerResizeEvent;

/// #DEBUG
export function DEBUG_set_triggerShownEvent(value) {
    triggerShownEvent = value;
}

export function DEBUG_set_triggerHidingEvent(value) {
    triggerHidingEvent = value;
}

export function DEBUG_set_triggerResizeEvent(value) {
    triggerResizeEvent = value;
}
/// #ENDDEBUG

export default VisibilityChangeModule;
