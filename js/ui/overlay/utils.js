import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = $element => {
    const window = getWindow();
    const offsetTop = $element.offset().top - $(window).scrollTop();
    const offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight();

    return Math.max(offsetTop, offsetBottom) * WINDOW_HEIGHT_PERCENT;
};
