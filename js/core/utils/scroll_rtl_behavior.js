import domAdapter from '../dom_adapter';
import callOnce from './call_once';

const getScrollRtlBehavior = callOnce(function() {
    const document = domAdapter.getDocument();

    /* Append a RTL scrollable 1px square containing a 2px-wide child and check
       the initial scrollLeft and whether it's possible to set a negative one.*/
    document.body.insertAdjacentHTML('beforeend', `<div style='direction: rtl;
       position: absolute; left: 0; top: -1; overflow: hidden; width: 1px;
       height: 1px;'><div style='width: 2px; height: 1px;'></div></div>`);

    const scroller = document.body.lastElementChild;
    const initiallyPositive = scroller.scrollLeft > 0;
    scroller.scrollLeft = -1;
    const hasNegative = scroller.scrollLeft < 0;

    const result = {
        'decreasing': hasNegative || initiallyPositive,
        'positive': !hasNegative
    };

    document.body.removeChild(scroller);

    return result;
});

export default getScrollRtlBehavior;
