import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const window = getWindow();

    let actualOffset;
    if(startLocation) {
        actualOffset = $(window).innerHeight() - startLocation + $(window).scrollTop();
    } else {
        const offsetTop = $element.offset().top - $(window).scrollTop();
        const offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight();
        actualOffset = Math.max(offsetTop, offsetBottom);
    }

    return actualOffset * WINDOW_HEIGHT_PERCENT;
};
