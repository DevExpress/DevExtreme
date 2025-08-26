import dateUtils from '@js/core/utils/date';

import type { SafeAppointment, ViewType } from '../../types';

const toMs = dateUtils.dateToMilliseconds;
const VERTICAL_VIEW_TYPES = ['day', 'week', 'workWeek'];

interface Size {
  width: number;
  height: number;
}
interface Options {
  viewType: ViewType;
  cellSize: Size;
  cellDurationInMinutes: number;
  resizableStep: number;
  isAllDay: (itemData: SafeAppointment) => boolean;
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
  itemData: SafeAppointment,
  options: Options,
): number => {
  const { viewType, resizableStep, isAllDay } = options;
  switch (true) {
    case ['timelineMonth', 'month'].includes(viewType):
      return getAllDayDeltaWidth(args, initialSize, resizableStep) * toMs('day');
    case viewType === 'agenda':
      return 0;
    case VERTICAL_VIEW_TYPES.includes(viewType) && !isAllDay(itemData):
      return getVerticalDeltaTime(args, initialSize, options);
    default:
      return isAllDay(itemData)
        ? getAllDayDeltaWidth(args, initialSize, resizableStep) * toMs('day')
        : getHorizontalDeltaTime(args, initialSize, options);
  }
};
