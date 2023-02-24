import { getInnerHeight, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { isNumeric, isDefined } from '../../core/utils/type';
import domAdapter from '../../core/dom_adapter';

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

    const prevSettings = {
        overflow: null,
        paddingRight: null,
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
            setBodyPaddingRight();
            setBodyOverflow();
        },
        restoreOverflow() {
            restoreBodyPaddingRight();
            restoreBodyOverflow();
        },
    };
};
