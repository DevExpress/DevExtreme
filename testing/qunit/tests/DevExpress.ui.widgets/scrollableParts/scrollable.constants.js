import simulatedStrategy from 'ui/scroll_view/ui.scrollable.simulated';

export const SCROLLABLE_CLASS = 'dx-scrollable';
export const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
export const SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';
export const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
export const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
export const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
export const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
export const SCROLLBAR_VERTICAL_CLASS = 'dx-scrollbar-vertical';
export const SCROLLBAR_HORIZONTAL_CLASS = 'dx-scrollbar-horizontal';
export const SCROLLABLE_NATIVE_CLASS = 'dx-scrollable-native';
export const SCROLLABLE_SCROLLBARS_HIDDEN = 'dx-scrollable-scrollbars-hidden';
export const SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = 'dx-scrollable-scrollbars-alwaysvisible';
export const SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled';
export const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active';
export const RTL_CLASS = 'dx-rtl';
export const SCROLLBAR_HOVERABLE_CLASS = 'dx-scrollbar-hoverable';

export const FRAME_DURATION = simulatedStrategy.FRAME_DURATION;
export const ACCELERATION = simulatedStrategy.ACCELERATION;
export const MIN_VELOCITY_LIMIT = simulatedStrategy.MIN_VELOCITY_LIMIT;

export const calculateInertiaDistance = function(distance, duration) {
    let velocity = FRAME_DURATION * distance / duration;
    let result = 0;

    while(Math.abs(velocity) > MIN_VELOCITY_LIMIT) {
        result += velocity;
        velocity = velocity * ACCELERATION;
    }

    return result;
};
