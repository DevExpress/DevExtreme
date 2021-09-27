import config from '../config';
import { isWindow } from '../utils/type';
import domAdapter from '../dom_adapter';

const getDefaultAlignment = (isRtlEnabled) => {
    const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;

    return rtlEnabled ? 'right' : 'left';
};

const getBoundingRect = (element) => {
    if(isWindow(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        };
    }

    if(domAdapter.getDocumentElement()) {
        return element.getBoundingClientRect();
    }

    return 0;
};

export {
    getBoundingRect,
    getDefaultAlignment
};
