import { shiftIntervals } from '../../common/shift_intervals';
import { trimInterval } from '../../common/trim_interval';
import type { CompareOptions, DateInterval, LayoutIntervals } from '../../types';
import { getOneDayCellIntervals } from './get_one_day_cell_intervals';

const MONTH_INTERVAL_DAYS_COUNT = 7;

const splitBy7Days = (intervals: DateInterval): DateInterval[] => {
  const result: DateInterval[] = [];
  const date = new Date(intervals.min);

  while (date.getTime() < intervals.max) {
    const min = date.getTime();
    date.setUTCDate(date.getUTCDate() + MONTH_INTERVAL_DAYS_COUNT);
    result.push({ min, max: date.getTime() });
  }

  return result;
};

const cropIntervalsByDayHours = (
  intervals: DateInterval[],
  startDayHour: number,
  endDayHour: number,
): DateInterval[] => intervals.map((item) => ({
  ...item,
  min: new Date(item.min).setUTCHours(startDayHour, 0, 0, 0),
  max: new Date(item.max - 1).setUTCHours(endDayHour, 0, 0, 0),
}));

export const getMonthIntervals = (
  {
    startDayHour, endDayHour, skippedDays, ...dateInterval
  }: CompareOptions,
  viewOffset: number,
  isTimeline: boolean,
): LayoutIntervals => {
  const trimmedInterval = trimInterval(dateInterval);
  const intervals = isTimeline ? [trimmedInterval] : splitBy7Days(trimmedInterval);
  const croppedIntervals = cropIntervalsByDayHours(intervals, startDayHour, endDayHour);
  const shiftedIntervals = shiftIntervals(croppedIntervals, viewOffset);

  const cells = getOneDayCellIntervals({
    intervals,
    startDayHour,
    endDayHour,
    skippedDays,
  });
  const shiftedCells = shiftIntervals(cells, viewOffset);

  return {
    cells: shiftedCells,
    intervals: shiftedIntervals,
  };
};
