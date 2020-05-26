import $ from '../renderer';
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

    let rect;
    try {
        rect = element.getBoundingClientRect();
    } catch(e) {
        // TODO: add warning "IE throws Unspecified error if there is no such element on the page DOM"

        rect = {
            width: 0,
            height: 0,
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        };
    }

    return rect;
};

exports.getDefaultAlignment = getDefaultAlignment;
exports.getBoundingRect = getBoundingRect;
