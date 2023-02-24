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


let previousBodyOverflowSetting;
let previousBodyPaddingRight;

const setOverflowHidden = () => {
    const window = getWindow();
    const $body = $(domAdapter.getBody());

    if(!isDefined(previousBodyPaddingRight)) {
        const scrollBarWidth = window.innerWidth - domAdapter.getDocument().documentElement.clientWidth;

        if(scrollBarWidth > 0) {
            const computedBodyPaddingRight = parseInt(window.getComputedStyle($body.get(0)).getPropertyValue('padding-right'), 10);
            previousBodyPaddingRight = $body.css('paddingRight');
            $body.css('paddingRight', `${computedBodyPaddingRight + scrollBarWidth}px`);
        }
    }

    if(!isDefined(previousBodyOverflowSetting)) {
        previousBodyOverflowSetting = $body.css('overflow');
        $body.css('overflow', 'hidden');
    }
};

const restoreOverflowSetting = () => {
    const $body = $(domAdapter.getBody());
    if(isDefined(previousBodyPaddingRight)) {
        $body.css('paddingRight', previousBodyPaddingRight);

        previousBodyPaddingRight = undefined;
    }

    if(isDefined(previousBodyOverflowSetting)) {
        $body.css('overflow', previousBodyOverflowSetting);

        previousBodyOverflowSetting = undefined;
    }
};

export const disableBodyScroll = () => {
    setOverflowHidden();
};

export const enableBodyScroll = () => {
    restoreOverflowSetting();
};
