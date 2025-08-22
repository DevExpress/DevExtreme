import type {
  RawCollectorSize,
  RealSize,
} from '../types';

const getPxValue = (value = ''): number => {
  if (!value.endsWith('px')) {
    return 0;
  }

  return parseInt(value, 10) || 0;
};

export const getCollectorSize = (
  cellSize: RealSize,
  rawCollectorSize: RawCollectorSize,
): {
  collectorSize: RealSize;
  collectorWithMarginsSize: RealSize;
} => {
  const parsedSize = {
    height: getPxValue(rawCollectorSize.height),
    width: getPxValue(rawCollectorSize.width),
    marginRight: getPxValue(rawCollectorSize.marginRight),
    marginLeft: getPxValue(rawCollectorSize.marginLeft),
    marginTop: getPxValue(rawCollectorSize.marginTop),
    marginBottom: getPxValue(rawCollectorSize.marginBottom),
  };
  const marginHeight = parsedSize.marginTop + parsedSize.marginBottom;
  const marginWidth = parsedSize.marginLeft + parsedSize.marginRight;
  const height = parsedSize.height
    ? parsedSize.height + marginHeight
    : cellSize.height;
  const width = parsedSize.width
    ? parsedSize.width + marginWidth
    : cellSize.width;

  return {
    collectorSize: { width: width - marginWidth, height: height - marginHeight },
    collectorWithMarginsSize: { width, height },
  };
};
