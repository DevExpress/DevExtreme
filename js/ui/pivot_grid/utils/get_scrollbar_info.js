import $ from '../../../core/renderer';

const scrollBarInfoCache = {};

export function getScrollBarInfo(useNativeScrolling) {
    if(scrollBarInfoCache[useNativeScrolling]) {
        return scrollBarInfoCache[useNativeScrolling];
    }

    let scrollBarWidth = 0;
    const options = {};

    const container = $('<div>').appendTo('body');
    const scrollableContainer = $('<div>').css({
        position: 'absolute',
        visibility: 'hidden',
        top: -1000,
        left: -1000,
        width: 100,
        height: 100
    }).appendTo(container);

    const content = $('<p>').css({
        width: '100%',
        height: 200
    }).appendTo(scrollableContainer);

    if(useNativeScrolling !== 'auto') {
        options.useNative = !!useNativeScrolling;
        options.useSimulatedScrollbar = !useNativeScrolling;
    }

    scrollableContainer.dxScrollable(options);

    const scrollBarUseNative = scrollableContainer.dxScrollable('instance').option('useNative');
    scrollBarWidth = scrollBarUseNative ? scrollableContainer.width() - content.width() : 0;

    container.remove();

    scrollBarInfoCache[useNativeScrolling] = {
        scrollBarWidth: scrollBarWidth,
        scrollBarUseNative: scrollBarUseNative
    };

    return scrollBarInfoCache[useNativeScrolling];
}
