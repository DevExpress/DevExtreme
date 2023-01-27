import { getNextDefsSvgId } from './core/utils';

const graphic_objects = {};

export const registerPattern = (options) => {
    const id = getNextDefsSvgId();
    graphic_objects[id] = { element: 'pattern', ...options };
    return id;
};

export const registerGradient = (type, options) => {
    const id = getNextDefsSvgId();
    graphic_objects[id] = { element: type, ...options };
    return id;
};

export const getGraphicObjects = () => {
    return graphic_objects;
};
