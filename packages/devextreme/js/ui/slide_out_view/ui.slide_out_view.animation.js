import fx from '../../animation/fx';

const ANIMATION_DURATION = 400;

export const animation = {
    moveTo: function($element, position, completeAction) {
        fx.animate($element, {
            type: 'slide',
            to: { left: position },
            duration: ANIMATION_DURATION,
            complete: completeAction
        });
    },
    complete: function($element) {
        fx.stop($element, true);
    }
};
