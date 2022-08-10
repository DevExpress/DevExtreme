import $ from '../../core/renderer';
import { isDxMouseWheelEvent } from '../../events/utils/index';

const allowScroll = function(container, delta, shiftKey) {
    const $container = $(container);
    const scrollTopPos = shiftKey ? $container.scrollLeft() : $container.scrollTop();

    const prop = shiftKey ? 'Width' : 'Height';
    const scrollSize = $container.prop(`scroll${prop}`);
    const clientSize = $container.prop(`client${prop}`);
    // NOTE: round to the nearest integer towards zero
    const scrollBottomPos = (scrollSize - clientSize - scrollTopPos) | 0;

    if(scrollTopPos === 0 && scrollBottomPos === 0) {
        return false;
    }

    const isScrollFromTop = scrollTopPos === 0 && delta >= 0;
    const isScrollFromBottom = scrollBottomPos === 0 && delta <= 0;
    const isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;

    if(isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
        return true;
    }
};

const prepareScrollData = function(container, validateTarget) {
    const $container = $(container);
    const isCorrectTarget = function(eventTarget) {
        return validateTarget ? $(eventTarget).is(container) : true;
    };

    return {
        validate: function(e) {
            if(isDxMouseWheelEvent(e) && isCorrectTarget(e.target)) {
                if(allowScroll($container, -e.delta, e.shiftKey)) {
                    e._needSkipEvent = true;
                    return true;
                }
                return false;
            }
        }
    };
};

export {
    allowScroll,
    prepareScrollData
};
