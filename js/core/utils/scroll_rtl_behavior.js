import domAdapter from '../dom_adapter';
import callOnce from './call_once';

const markupToAppend = `
<div style="position: absolute; overflow: hidden; direction: rtl;    width: 1px; height: 1px;   left: 0; top: -1;">
    <div style="width: 2px; height: 1px;">
    </div>
</div>`;

const canScrollBeNegative = (element) => {
    element.scrollLeft = -1;
    return element.scrollLeft < 0;
};

const getScrollRtlBehavior = callOnce(function() {
    const document = domAdapter.getDocument();

    document.body.insertAdjacentHTML('beforeend', markupToAppend);

    const elementToScroll = document.body.lastElementChild;
    const defaultScrollLeft = elementToScroll.scrollLeft;

    const negative = canScrollBeNegative(elementToScroll);

    document.body.removeChild(elementToScroll);

    return {
        'decreasing': negative || (defaultScrollLeft > 0),
        'positive': !negative
    };
});

export default getScrollRtlBehavior;
