import { getInnerHeight, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { isNumeric, isDefined } from '../../core/utils/type';
import domAdapter from '../../core/dom_adapter';
import devices from '../../core/devices';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const $window = $(getWindow());
    const { top: elementOffset } = $element.offset();
    let actualOffset;

    if(isNumeric(startLocation)) {
        if(startLocation < elementOffset) {
            return elementOffset - startLocation;
        } else {
            actualOffset = getInnerHeight($window) - startLocation + $window.scrollTop();
        }
    } else {
        const offsetTop = elementOffset - $window.scrollTop();
        const offsetBottom = getInnerHeight($window) - offsetTop - getOuterHeight($element);
        actualOffset = Math.max(offsetTop, offsetBottom);
    }

    return actualOffset * WINDOW_HEIGHT_PERCENT;
};

export const createBodyOverflowManager = () => {
    const window = getWindow();
    const documentElement = domAdapter.getDocument().documentElement;
    const $body = $(domAdapter.getBody());

    const isIosDevice = devices.real().platform === 'ios';

    const prevSettings = {
        overflow: null,
        paddingRight: null,
        position: null,
        top: null,
        left: null,
    };

    const setBodyPositionFixed = () => {
        if(isDefined(prevSettings.position)) {
            return;
        }

        const body = $body.get(0);
        const { scrollY, scrollX } = window;
        prevSettings.position = body.style.position;
        prevSettings.top = body.style.top;
        prevSettings.left = body.style.left;

        $body.css({ position: 'fixed', top: `${-scrollY}px`, left: `${-scrollX}px` });
    };

    const restoreBodyPositionFixed = () => {
        if(!isDefined(prevSettings.position)) {
            return;
        }

        const body = $body.get(0);

        const scrollY = -parseInt(body.style.top, 10);
        const scrollX = -parseInt(body.style.left, 10);

        const { position, top, left } = prevSettings;

        $body.css({ position, top, left });

        window.scrollTo(scrollX, scrollY);

        prevSettings.position = null;
    };

    const setBodyPaddingRight = () => {
        const scrollBarWidth = window.innerWidth - documentElement.clientWidth;
        if(prevSettings.paddingRight || scrollBarWidth <= 0) {
            return;
        }
        const paddingRight = window.getComputedStyle($body.get(0)).getPropertyValue('padding-right');
        const computedBodyPaddingRight = parseInt(paddingRight, 10);
        prevSettings.paddingRight = $body.css('paddingRight');
        $body.css('paddingRight', `${computedBodyPaddingRight + scrollBarWidth}px`);
    };
    const restoreBodyPaddingRight = () => {
        if(!isDefined(prevSettings.paddingRight)) {
            return;
        }
        $body.css('paddingRight', prevSettings.paddingRight);
        prevSettings.paddingRight = null;
    };
    const setBodyOverflow = () => {
        if(prevSettings.overflow) {
            return;
        }
        prevSettings.overflow = $body.css('overflow');
        $body.css('overflow', 'hidden');
    };
    const restoreBodyOverflow = () => {
        $body.css('overflow', prevSettings.overflow);
        prevSettings.overflow = null;
    };
    return {
        setOverflow() {
            if(isIosDevice) {
                setBodyPositionFixed();
            } else {
                setBodyPaddingRight();
                setBodyOverflow();
            }
        },
        restoreOverflow() {
            if(isIosDevice) {
                restoreBodyPositionFixed();
            } else {
                restoreBodyPaddingRight();
                restoreBodyOverflow();
            }
        },
    };
};
