import $ from '../../core/renderer';
import windowUtils from '../../core/utils/window';
import { isNumeric } from '../../core/utils/type';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const window = windowUtils.getWindow();

    let actualOffset;
    if(isNumeric(startLocation)) {
        actualOffset = $(window).innerHeight() - startLocation + $(window).scrollTop();
    } else {
        const offsetTop = $element.offset().top - $(window).scrollTop();
        const offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight();
        actualOffset = Math.max(offsetTop, offsetBottom);
    }

    return actualOffset * WINDOW_HEIGHT_PERCENT;
};
