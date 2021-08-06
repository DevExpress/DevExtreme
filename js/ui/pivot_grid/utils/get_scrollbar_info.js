import $ from '../../../core/renderer';
import { getScrollbarWidth } from './get_scrollbar_width';

const scrollBarInfoCache = {};

export function getScrollBarInfo(useNative) {
    if(scrollBarInfoCache[useNative]) {
        return scrollBarInfoCache[useNative];
    }

    const $dummyContainer = $('<div>').appendTo('body');

    try {
        let scrollBarWidth = 0;
        const options = {};

        const $dummyScrollable = $('<div>').css({
            position: 'absolute',
            visibility: 'hidden',
            top: -1000,
            left: -1000,
            width: 100,
            height: 100
        }).appendTo($dummyContainer);

        $('<p>').css({
            width: '100%',
            height: 200
        }).appendTo($dummyScrollable);

        if(useNative !== 'auto') {
            options.useNative = !!useNative;
            options.useSimulatedScrollbar = !useNative;
        }

        const scrollable = $dummyScrollable.dxScrollable(options).dxScrollable('instance');

        const scrollBarUseNative = scrollable.option('useNative');
        scrollBarWidth = scrollBarUseNative ? getScrollbarWidth($(scrollable.container()).get(0)) : 0;

        scrollBarInfoCache[useNative] = {
            scrollBarWidth: scrollBarWidth,
            scrollBarUseNative: scrollBarUseNative
        };
    } finally {
        $dummyContainer.remove();
    }

    return scrollBarInfoCache[useNative];
}
