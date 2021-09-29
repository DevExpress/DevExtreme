import config from '../config';
import { isWindow } from '../utils/type';

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

    return element.getBoundingClientRect();
};

export {
    getBoundingRect,
    getDefaultAlignment
};
