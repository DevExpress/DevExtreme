import { hasWindow, getWindow } from '../../core/utils/window';

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

const unSubscribeOnVisualViewportEvent = (eventName, callback, options) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportEventMap[eventName];

    visualViewport.removeEventListener(event, callback, options);
};

const subscribeOnVisualViewportEvent = (eventName, callback, options) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportEventMap[eventName];

    visualViewport.addEventListener(event, callback, options);

    return () => unSubscribeOnVisualViewportEvent(event, callback, options);
};

export {
    visualViewportEventMap,
    hasVisualViewport,
    getVisualViewportSizes,
    subscribeOnVisualViewportEvent,
};
