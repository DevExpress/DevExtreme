import { getNextDefsSvgId } from './core/utils';

const graphic_objects = {};

export const registerPattern = (options) => {
    const id = getNextDefsSvgId();
    graphic_objects[id] = { options: options, element: 'pattern' };
    return id;
};

export const registerGradient = (type, options) => {
    const id = getNextDefsSvgId();
    graphic_objects[id] = { options: options, element: type };
    return id;
};

export const getGraphicObjects = () => {
    return graphic_objects;
};
