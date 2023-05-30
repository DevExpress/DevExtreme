import { getWindow } from '../../core/utils/window';

const visualViewportListenerNames = {
    resize: 'resize',
    scroll: 'scroll',
};

const getVisualViewport = () => {
    const { visualViewport } = getWindow();

    return visualViewport;
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
    const event = visualViewportListenerNames[eventName];

    visualViewport.addEventListener(event, callback);
};

const unSubscribeOnVisualViewportEvent = (eventName, callback) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportListenerNames[eventName];

    visualViewport.removeEventListener(event, callback);
};

export {
    hasVisualViewport,
    getVisualViewport,
    getVisualViewportSizes,
    visualViewportListenerNames,
    subscribeOnVisualViewportEvent,
    unSubscribeOnVisualViewportEvent,
};
