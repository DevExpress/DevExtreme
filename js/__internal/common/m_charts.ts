import { getNextDefsSvgId } from '@js/viz/core/utils';

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

const getGraphicObjects = () => graphicObjects;

export default { getGraphicObjects };
