import simulatedStrategy from 'ui/scroll_view/ui.scrollable.simulated';

export const
    SCROLLABLE_CLASS = 'dx-scrollable',
    SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container',
    SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper',
    SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content',
    SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar',
    SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll',
    SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content',
    SCROLLBAR_VERTICAL_CLASS = 'dx-scrollbar-vertical',
    SCROLLBAR_HORIZONTAL_CLASS = 'dx-scrollbar-horizontal',
    SCROLLABLE_NATIVE_CLASS = 'dx-scrollable-native',
    SCROLLABLE_SCROLLBARS_HIDDEN = 'dx-scrollable-scrollbars-hidden',
    SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = 'dx-scrollable-scrollbars-alwaysvisible',
    SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled',
    SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active',
    RTL_CLASS = 'dx-rtl',
    SCROLLBAR_HOVERABLE_CLASS = 'dx-scrollbar-hoverable',

    FRAME_DURATION = simulatedStrategy.FRAME_DURATION,
    ACCELERATION = simulatedStrategy.ACCELERATION,
    MIN_VELOCITY_LIMIT = simulatedStrategy.MIN_VELOCITY_LIMIT,

    calculateInertiaDistance = function(distance, duration) {
        var velocity = FRAME_DURATION * distance / duration,
            result = 0;

        while(Math.abs(velocity) > MIN_VELOCITY_LIMIT) {
            result += velocity;
            velocity = velocity * ACCELERATION;
        }

        return result;
    };
