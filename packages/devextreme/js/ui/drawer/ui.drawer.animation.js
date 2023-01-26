import fx from '../../animation/fx';
import { camelize } from '../../core/utils/inflector';

export const animation = {
    moveTo(config) {
        const $element = config.$element;
        const position = config.position;
        const direction = config.direction || 'left';
        const toConfig = {};
        let animationType;

        switch(direction) {
            case 'right':
                toConfig['transform'] = 'translate(' + position + 'px, 0px)';
                animationType = 'custom';
                break;
            case 'left':
                toConfig['left'] = position;
                animationType = 'slide';
                break;
            case 'top':
            case 'bottom':
                toConfig['top'] = position;
                animationType = 'slide';
        }

        fx.animate($element, {
            type: animationType,
            to: toConfig,
            duration: config.duration,
            complete: config.complete
        });
    },
    margin(config) {
        const $element = config.$element;
        const margin = config.margin;
        const direction = config.direction || 'left';
        const toConfig = {};

        toConfig['margin' + camelize(direction, true)] = margin;

        fx.animate($element, {
            to: toConfig,
            duration: config.duration,
            complete: config.complete
        });
    },
    fade($element, config, duration, completeAction) {
        fx.animate($element, {
            type: 'fade',
            to: config.to,
            from: config.from,
            duration,
            complete: completeAction
        });
    },

    size(config) {
        const $element = config.$element;
        const size = config.size;
        const direction = config.direction || 'left';
        const marginTop = config.marginTop || 0;
        const duration = config.duration;
        const toConfig = {};


        if(direction === 'right' || direction === 'left') {
            toConfig['width'] = size;
        } else {
            toConfig['height'] = size;
        }

        if(direction === 'bottom') {
            toConfig['marginTop'] = marginTop;
        }

        fx.animate($element, {
            to: toConfig,
            duration,
            complete: config.complete
        });
    },

    complete($element) {
        fx.stop($element, true);
    }
};
