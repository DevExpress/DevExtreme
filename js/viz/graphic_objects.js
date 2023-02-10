import { getNextDefsSvgId } from './core/utils';

const graphicObjects = {};

export const registerPattern = (options) => {
    const id = getNextDefsSvgId();
    graphicObjects[id] = { element: 'pattern', ...options };
    return id;
};

export const registerGradient = (type, options) => {
    const id = getNextDefsSvgId();
    graphicObjects[id] = { element: type, ...options };
    return id;
};

export const getGraphicObjects = () => {
    return graphicObjects;
};
