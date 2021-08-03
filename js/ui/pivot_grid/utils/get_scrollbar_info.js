import $ from '../../../core/renderer';
import { getScrollbarWidth } from './get_scrollbar_width';

const scrollBarInfoCache = {};

export function getScrollBarInfo(useNative) {
    if(scrollBarInfoCache[useNative]) {
        return scrollBarInfoCache[useNative];
    }

    let scrollBarWidth = 0;
    const options = {};

    const $testContainer = $('<div>').appendTo('body');
    const $scrollable = $('<div>').css({
        position: 'absolute',
        visibility: 'hidden',
        top: -1000,
        left: -1000,
        width: 100,
        height: 100
    }).appendTo($testContainer);

    $('<p>').css({
        width: '100%',
        height: 200
    }).appendTo($scrollable);

    if(useNative !== 'auto') {
        options.useNative = !!useNative;
        options.useSimulatedScrollbar = !useNative;
    }

    const scrollable = $scrollable.dxScrollable(options).dxScrollable('instance');

    const scrollBarUseNative = scrollable.option('useNative');
    scrollBarWidth = scrollBarUseNative ? getScrollbarWidth($(scrollable.container()).get(0)) : 0;

    $testContainer.remove();

    scrollBarInfoCache[useNative] = {
        scrollBarWidth: scrollBarWidth,
        scrollBarUseNative: scrollBarUseNative
    };

    return scrollBarInfoCache[useNative];
}
