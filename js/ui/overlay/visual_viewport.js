import { hasWindow, getWindow } from '@js/core/utils/window';

const getVisualViewport = () => {
    const doesWindowExist = hasWindow();

    if(doesWindowExist) {
        const { visualViewport } = getWindow();

        return visualViewport;
    }

    return null;
};

const getViewportWidth = () => {
    const visualViewport = getVisualViewport();

    const { width } = visualViewport;

    return width;
};

const getViewportHeight = () => {
    const visualViewport = getVisualViewport();

    const { height } = visualViewport;

    return height;
};

export {
    getViewportWidth,
    getViewportHeight,
};
