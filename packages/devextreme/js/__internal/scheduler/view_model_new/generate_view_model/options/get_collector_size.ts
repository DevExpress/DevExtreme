import type {
  CollectorCSS,
  RealSize,
} from '../steps/add_geometry/types';

const DEFAULT_COLLECTOR_HEIGHT = 20;
const getPxValue = (value = '', defaultValue = 0): number => {
  if (!value.endsWith('px')) {
    return defaultValue;
  }

  return parseInt(value, 10) || defaultValue;
};

export const getCollectorSize = (
  cellSize: RealSize,
  collectorCSS: CollectorCSS,
  defaultCollectorWidth: number,
): {
  collectorSize: RealSize;
  collectorWithMarginsSize: RealSize;
} => {
  const parsedSize = {
    height: getPxValue(collectorCSS.height, DEFAULT_COLLECTOR_HEIGHT),
    width: getPxValue(collectorCSS.width, defaultCollectorWidth),
    marginRight: getPxValue(collectorCSS.marginRight),
    marginLeft: getPxValue(collectorCSS.marginLeft),
    marginTop: getPxValue(collectorCSS.marginTop),
    marginBottom: getPxValue(collectorCSS.marginBottom),
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
