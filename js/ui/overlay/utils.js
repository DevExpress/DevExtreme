import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { isNumeric } from '../../core/utils/type';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const $window = $(getWindow());
    const { top: elementOffset } = $element.offset();
    let actualOffset;

    if(isNumeric(startLocation)) {
        if(startLocation < elementOffset) {
            return elementOffset - startLocation;
        } else {
            actualOffset = $window.innerHeight() - startLocation + $window.scrollTop();
        }
    } else {
        const offsetTop = elementOffset - $window.scrollTop();
        const offsetBottom = $window.innerHeight() - offsetTop - $element.outerHeight();
        actualOffset = Math.max(offsetTop, offsetBottom);
    }

    return actualOffset * WINDOW_HEIGHT_PERCENT;
};
