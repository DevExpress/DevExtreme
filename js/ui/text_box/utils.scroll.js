import $ from '../../core/renderer';

const allowScroll = function(container, delta, shiftKey) {
    const $container = $(container);
    const scrollTopPos = shiftKey ? $container.scrollLeft() : $container.scrollTop();

    const prop = shiftKey ? 'Width' : 'Height';
    const scrollBottomPos = $container.prop(`scroll${prop}`) - $container.prop(`client${prop}`) - scrollTopPos;

    if(scrollTopPos === 0 && scrollBottomPos === 0) {
        return false;
    }

    const isScrollFromTop = scrollTopPos === 0 && delta >= 0;
    const isScrollFromBottom = scrollBottomPos === 0 && delta <= 0;
    const isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;

    if(isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
        return true;
    }
};

export {
    allowScroll
};
