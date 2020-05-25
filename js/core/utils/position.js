import $ from 'jquery';
import config from '../config';
import typeUtils from '../utils/type';

const getDefaultAlignment = function(isRtlEnabled) {
    const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;

    return rtlEnabled ? 'right' : 'left';
};

const getBoundingRect = (instance) => {
    const element = $(instance).get(0);
    if(typeUtils.isWindow(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        };
    }
    return element.getBoundingClientRect();
};

exports.getDefaultAlignment = getDefaultAlignment;
exports.getBoundingRect = getBoundingRect;
