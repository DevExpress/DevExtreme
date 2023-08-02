import { getNextDefsSvgId } from '../viz/core/utils';

const graphicObjects = {};

export const registerPattern = (options) => {
    const id = getNextDefsSvgId();
    graphicObjects[id] = { type: 'pattern', ...options };
    return id;
};

export const registerGradient = (type, options) => {
    const id = getNextDefsSvgId();
    graphicObjects[id] = { type, ...options };
    return id;
};

export const getGraphicObjects = () => {
    return graphicObjects;
};
