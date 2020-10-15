import { hasWindow } from '../../core/utils/window';

const getElementWidth = function($element) {
    if(hasWindow()) {
        return $element.outerWidth();
    }
};

const getPopupWidth = function(width) {
    if(width === null) {
        width = undefined;
    }
    if(typeof width === 'function') {
        width = width();
    }

    return width;
};

export { getElementWidth, getPopupWidth };
