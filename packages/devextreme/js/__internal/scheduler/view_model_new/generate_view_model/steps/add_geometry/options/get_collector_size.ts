import type {
  RawCollectorSize,
  RealSize,
} from '../types';

const DEFAULT_COLLECTOR_HEIGHT = 20;
const getPxValue = (value = '', defaultValue = 0): number => {
  if (!value.endsWith('px')) {
    return defaultValue;
  }

  return parseInt(value, 10) || defaultValue;
};

export const getCollectorSize = (
  cellSize: RealSize,
  rawCollectorSize: RawCollectorSize,
): {
  collectorSize: RealSize;
  collectorWithMarginsSize: RealSize;
} => {
  const parsedSize = {
    height: getPxValue(rawCollectorSize.height, DEFAULT_COLLECTOR_HEIGHT),
    width: getPxValue(rawCollectorSize.width),
    marginRight: getPxValue(rawCollectorSize.marginRight),
    marginLeft: getPxValue(rawCollectorSize.marginLeft),
    marginTop: getPxValue(rawCollectorSize.marginTop),
    marginBottom: getPxValue(rawCollectorSize.marginBottom),
  };
  const marginHeight = parsedSize.marginTop + parsedSize.marginBottom;
  const marginWidth = parsedSize.marginLeft + parsedSize.marginRight;
  const height = parsedSize.height + marginHeight;
  const width = parsedSize.width
    ? parsedSize.width + marginWidth
    : cellSize.width;

  return {
    collectorSize: { width: width - marginWidth, height: height - marginHeight },
    collectorWithMarginsSize: { width, height },
  };
};
