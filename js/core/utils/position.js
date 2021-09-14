import config from '../config';
import domAdapter from '../dom_adapter';
import browser from '../utils/browser';
import { isWindow } from '../utils/type';

const getDefaultAlignment = (isRtlEnabled) => {
    const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;

    return rtlEnabled ? 'right' : 'left';
};

const getElementsFromPoint = (x, y) => {
    const document = domAdapter.getDocument();

    if(browser.msie) {
        const result = document.msElementsFromPoint(x, y);

        if(result) {
            return Array.prototype.slice.call(result);
        }

        return [];
    }

    return document.elementsFromPoint(x, y);
};

const getBoundingRect = (element) => {
    if(isWindow(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        };
    }
    return element.getBoundingClientRect();
};

export {
    getBoundingRect,
    getDefaultAlignment,
    getElementsFromPoint
};
