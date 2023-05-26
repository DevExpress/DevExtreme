import { getWindow } from '../../core/utils/window';

const getVisualViewport = () => {
    const { visualViewport } = getWindow();

    return visualViewport;
};

const hasVisualViewport = () => {
    const visualViewport = getVisualViewport();

    return !!visualViewport;
};

const getViewportSizes = () => {
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

export {
    hasVisualViewport,
    getViewportSizes,
};
