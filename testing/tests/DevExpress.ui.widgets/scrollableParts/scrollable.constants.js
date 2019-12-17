import simulatedStrategy from 'ui/scroll_view/ui.scrollable.simulated';

export const
    SCROLLABLE_CLASS = 'dx-scrollable';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
const SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
const SCROLLBAR_VERTICAL_CLASS = 'dx-scrollbar-vertical';
const SCROLLBAR_HORIZONTAL_CLASS = 'dx-scrollbar-horizontal';
const SCROLLABLE_NATIVE_CLASS = 'dx-scrollable-native';
const SCROLLABLE_SCROLLBARS_HIDDEN = 'dx-scrollable-scrollbars-hidden';
const SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = 'dx-scrollable-scrollbars-alwaysvisible';
const SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled';
const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active';
const RTL_CLASS = 'dx-rtl';
const SCROLLBAR_HOVERABLE_CLASS = 'dx-scrollbar-hoverable';

const FRAME_DURATION = simulatedStrategy.FRAME_DURATION;
const ACCELERATION = simulatedStrategy.ACCELERATION;
const MIN_VELOCITY_LIMIT = simulatedStrategy.MIN_VELOCITY_LIMIT;

const calculateInertiaDistance = function(distance, duration) {
    let velocity = FRAME_DURATION * distance / duration;
    let result = 0;

    while(Math.abs(velocity) > MIN_VELOCITY_LIMIT) {
        result += velocity;
        velocity = velocity * ACCELERATION;
    }

    return result;
};
