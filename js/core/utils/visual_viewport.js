import { hasWindow, getWindow } from '../../core/utils/window';
import domAdapter from '../dom_adapter';

const visualViewportEventMap = {
    resize: 'resize',
    scroll: 'scroll',
};

const getVisualViewport = () => {
    const isWindowAvailable = hasWindow();

    if(isWindowAvailable) {
        const { visualViewport } = getWindow();

        return visualViewport;
    }

    return null;
};

const hasVisualViewport = () => {
    const visualViewport = getVisualViewport();

    return !!visualViewport;
};

const getVisualViewportSizes = () => {
    const visualViewport = getVisualViewport();

    const {
        width,
        height,
        scale,
        pageTop,
        pageLeft,
        offsetTop,
        offsetLeft,
    } = visualViewport;

    return {
        width,
        height,
        scale,
        pageTop,
        pageLeft,
        offsetTop,
        offsetLeft,
    };
};

const subscribeOnVisualViewportEvent = (eventName, callback, options) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportEventMap[eventName];

    const unSubscribeOnVisualViewportCallback = domAdapter.listen(visualViewport, event, callback, options);

    return unSubscribeOnVisualViewportCallback;
};

export {
    visualViewportEventMap,
    hasVisualViewport,
    getVisualViewportSizes,
    subscribeOnVisualViewportEvent,
};
