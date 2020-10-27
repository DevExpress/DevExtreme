import domAdapter from '../dom_adapter';
import config from '../config';
import typeUtils from '../utils/type';

const getDefaultAlignment = function(isRtlEnabled) {
    const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;

    return rtlEnabled ? 'right' : 'left';
};

const getBoundingRect = (element) => {
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
        // NOTE: IE throws 'Unspecified error' if there is no such element on the page DOM

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

function getScrollBehavior() {
    const document = domAdapter.getDocument();

    /* Append a RTL scrollable 1px square containing a 2px-wide child and check
       the initial scrollLeft and whether it's possible to set a negative one.*/
    document.body.insertAdjacentHTML('beforeend', '<div style=\'direction: rtl;\
       position: absolute; left: 0; top: 0; overflow: hidden; width: 1px;\
       height: 1px;\'><div style=\'width: 2px; height: 1px;\'></div></div>');

    const scroller = document.body.lastElementChild;
    const initially_positive = scroller.scrollLeft > 0;
    scroller.scrollLeft = -1;
    const has_negative = scroller.scrollLeft < 0;

    const result = { 'decreasing': has_negative ||
                          initially_positive, 'positive': !has_negative };

    document.body.removeChild(scroller);

    return result;
}

exports.getDefaultAlignment = getDefaultAlignment;
exports.getBoundingRect = getBoundingRect;
exports.getScrollBehavior = getScrollBehavior;
