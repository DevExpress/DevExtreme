import domAdapter from '../../../core/dom_adapter';
import callOnce from '../../../core/utils/call_once';
import { getScrollbarWidth } from './get_scrollbar_width';

const calculateScrollbarWidth = callOnce(function() {
    const document = domAdapter.getDocument();

    document.body.insertAdjacentHTML('beforeend',
        '<div style=\'position: absolute; overflow: scroll; width: 100px; height: 100px; top: -9999;\'></div>');

    const scrollbar = document.body.lastElementChild;
    const scrollbarWidth = getScrollbarWidth(scrollbar);
    document.body.removeChild(scrollbar);

    return scrollbarWidth;
});

export { calculateScrollbarWidth };
