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

const subscribeOnVisualViewportEvent = (eventName, callback) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportEventMap[eventName];

    visualViewport.addEventListener(event, callback);
};

const unSubscribeOnVisualViewportEvent = (eventName, callback) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportEventMap[eventName];

    visualViewport.removeEventListener(event, callback);
};

export {
    hasVisualViewport,
    getVisualViewport,
    getVisualViewportSizes,
    visualViewportEventMap,
    subscribeOnVisualViewportEvent,
    unSubscribeOnVisualViewportEvent,
};
