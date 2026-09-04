import VisibilityChangeModule from '../../../__internal/events/visibility_change';

export let triggerShownEvent = VisibilityChangeModule.triggerShownEvent;
export let triggerHidingEvent = VisibilityChangeModule.triggerHidingEvent;
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
