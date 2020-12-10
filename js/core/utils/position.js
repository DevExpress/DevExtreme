import config from '../config';
import typeUtils from '../utils/type';
import $ from '../renderer';
import { each } from '../utils/iterator';
import { isWindow } from '../utils/type';
import { getWindow, hasWindow } from '../utils/window';

const window = getWindow();

const getDefaultAlignment = function(isRtlEnabled) {
    const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;

    return rtlEnabled ? 'right' : 'left';
};

const getBoundingRect = (element) => {
    if(typeUtils.isWindow(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        };
    }

    let rect;
    try {
        rect = element.getBoundingClientRect();
    } catch(e) {
        // NOTE: IE throws 'Unspecified error' if there is no such element on the page DOM

        rect = {
            width: 0,
            height: 0,
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        };
    }

    return rect;
};

const getCustomBoundaryContainer = (container) => {
    const $container = container && $(container);
    let result;

    if($container && $container.length && hasWindow() && !isWindow($(container).get(0))) {
        const $containerWithParents = [].slice.call($container.parents());
        $containerWithParents.unshift($container.get(0));

        each($containerWithParents, function(i, parent) {
            if(parent !== $('body').get(0) && window.getComputedStyle(parent).overflowY === 'hidden') {
                result = $(parent);
                return false;
            }
        }.bind(this));
    }

    return result;
};

export {
    getBoundingRect,
    getDefaultAlignment,
    getCustomBoundaryContainer
};
