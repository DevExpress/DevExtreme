import { getWindow } from '../../core/utils/window';
import { visualViewportCallback } from './visual_viewport_callbacks';

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

    visualViewportCallback.add(event, callback);
    // Add eventEngine
    visualViewport.addEventListener(event, callback);
};

const unSubscribeOnVisualViewportEvent = (eventName) => {
    const visualViewport = getVisualViewport();
    const event = visualViewportListenerNames[eventName];

    const callback = visualViewportCallback.get(event);

    // Add eventEngine
    visualViewport.removeEventListener(event, callback);
    visualViewportCallback.remove(event);
};

export {
    hasVisualViewport,
    getVisualViewport,
    getVisualViewportSizes,
    visualViewportListenerNames,
    subscribeOnVisualViewportEvent,
    unSubscribeOnVisualViewportEvent,
};
