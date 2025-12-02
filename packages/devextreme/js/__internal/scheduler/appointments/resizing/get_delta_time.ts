import dateUtils from '@js/core/utils/date';

import { VERTICAL_VIEW_TYPES } from '../../constants';
import type { ViewType } from '../../types';

const toMs = dateUtils.dateToMilliseconds;

interface Size {
  width: number;
  height: number;
}
interface Options {
  viewType: ViewType;
  cellSize: Size;
  cellDurationInMinutes: number;
  resizableStep: number;
  isAllDayPanel: boolean;
}

const MIN_RESIZABLE_STEP = 2;
const getAllDayDeltaWidth = (args: Size, initialSize: Size, resizableStep: number): number => {
  const intervalWidth = resizableStep || MIN_RESIZABLE_STEP;
  const initialWidth = initialSize.width;

  return Math.round((args.width - initialWidth) / intervalWidth);
};
const getHorizontalDeltaTime = (args: Size, initialSize: Size, {
  cellSize,
  cellDurationInMinutes,
}: Options): number => {
  const deltaWidth = args.width - initialSize.width;
  const deltaTime = toMs('minute') * Math.round((deltaWidth * cellDurationInMinutes) / cellSize.width);
  return deltaTime;
};
const getVerticalDeltaTime = (args: Size, initialSize: Size, {
  cellSize,
  cellDurationInMinutes,
}: Options): number => {
  const deltaHeight = args.height - initialSize.height;
  const deltaTime = toMs('minute') * Math.round((deltaHeight * cellDurationInMinutes) / cellSize.height);
  return deltaTime;
};

export const getDeltaTime = (
  args: Size,
  initialSize: Size,
  options: Options,
): number => {
  const { viewType, resizableStep, isAllDayPanel } = options;
  switch (true) {
    case ['timelineMonth', 'month'].includes(viewType) || Boolean(isAllDayPanel):
      return getAllDayDeltaWidth(args, initialSize, resizableStep) * toMs('day');
    case viewType === 'agenda':
      return 0;
    case VERTICAL_VIEW_TYPES.includes(viewType) && !isAllDayPanel:
      return getVerticalDeltaTime(args, initialSize, options);
    default:
      return getHorizontalDeltaTime(args, initialSize, options);
  }
};
