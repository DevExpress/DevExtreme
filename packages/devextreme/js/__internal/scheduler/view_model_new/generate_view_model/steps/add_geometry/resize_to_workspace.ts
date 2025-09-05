import type {
  Geometry,
  GeometryOptions,
  RealSize,
} from './types';

const getPanelSizeByInterval = (
  interval: RealSize,
  {
    intervals,
    groupOrientation,
    isTimeline,
    groupCount,
  }: GeometryOptions,
): RealSize => {
  const resultInterval = { ...interval };

  if (isTimeline) {
    resultInterval.width *= intervals.length;
  } else {
    resultInterval.height *= intervals.length;
  }

  if (groupCount) {
    if (groupOrientation === 'horizontal') {
      resultInterval.width *= groupCount;
    } else {
      resultInterval.height *= groupCount;
    }
  }

  return resultInterval;
};

// TODO: just an example to demonstrate, that even for wide workspace error of values is small
//  7248.828125 instead of 7249. It converts value from 282.421875 to 282.428572
//  Remove it after review
export const resizeToWorkspace = (
  entity: Geometry,
  options: GeometryOptions,
): void => {
  const { panelSize, intervalSize } = options;
  if (panelSize.width === 0 || panelSize.height === 0) {
    return;
  }

  const panelSizeByInterval = getPanelSizeByInterval(intervalSize, options);
  entity.left *= panelSize.width / panelSizeByInterval.width;
  entity.top *= panelSize.height / panelSizeByInterval.height;
  entity.width *= panelSize.width / panelSizeByInterval.width;
  entity.height *= panelSize.height / panelSizeByInterval.height;
};
