
import fx from '../../animation/fx';
import translator from '../../animation/translator';

export const _translator = {
    move($element, position) {
        translator.move($element, { left: position });
    }
};

export const animation = {
    moveTo($element, position, duration, completeAction) {
        fx.animate($element, {
            type: 'slide',
            to: { left: position },
            duration: duration,
            complete: completeAction
        });
    },

    complete($element) {
        fx.stop($element, true);
    }
};
