import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { isNumeric } from '../../core/utils/type';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const window = getWindow();

    let actualOffset;
    const offsetTop = $element.offset().top - $(window).scrollTop();
    if(isNumeric(startLocation)) {
        if(startLocation < offsetTop) {
            return offsetTop - startLocation;
        } else {
            actualOffset = $(window).innerHeight() - startLocation + $(window).scrollTop();
        }
    } else {
        const offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight();
        actualOffset = Math.max(offsetTop, offsetBottom);
    }

    return actualOffset * WINDOW_HEIGHT_PERCENT;
};
