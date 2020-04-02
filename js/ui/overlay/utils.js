import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const window = getWindow();
    const offsetTop = $element.offset().top - $(window).scrollTop();
    const offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight();
    let actualOffset;
    if(startLocation) {
        actualOffset = $(window).innerHeight() - startLocation + $(window).scrollTop();
    } else {
        actualOffset = Math.max(offsetTop, offsetBottom);
    }

    return actualOffset * WINDOW_HEIGHT_PERCENT;
};
