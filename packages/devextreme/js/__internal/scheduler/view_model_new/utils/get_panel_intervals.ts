import type { CompareOptions, DateInterval, PanelOptions } from '../types';
import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';
import { shiftIntervals } from './shift_intervals';

export const getPrevIntervalEndDate = (
  intervals: DateInterval[],
  isAllDayIntervals: boolean,
): number => {
  if (isAllDayIntervals) {
    return intervals[0].min;
  }

  const prevDate = new Date(intervals[0].max);
  prevDate.setDate(prevDate.getDate() - 1);

  return prevDate.getTime();
};

export const getNextIntervalStartDate = (
  intervals: DateInterval[],
  isAllDayIntervals: boolean,
): number => {
  if (isAllDayIntervals) {
    return intervals[intervals.length - 1].max;
  }

  const prevDate = new Date(intervals[intervals.length - 1].min);
  prevDate.setDate(prevDate.getDate() + 1);

  return prevDate.getTime();
};

export const getPanelIntervals = (
  compareOptions: CompareOptions,
  viewOffset: number,
  isAllDayPanel: boolean,
  isSplitByDays: boolean,
): PanelOptions => {
  const intervals = getVisibleDateTimeIntervals(
    compareOptions,
    isAllDayPanel,
    isSplitByDays,
  );
  const shiftedIntervals = shiftIntervals(intervals, viewOffset);
  const isAllDayIntervals = isAllDayPanel
    || (compareOptions.startDayHour === 0 && compareOptions.endDayHour === 24);

  return {
    intervals: shiftedIntervals,
    prevIntervalEndDate: getPrevIntervalEndDate(shiftedIntervals, isAllDayIntervals),
    nextIntervalStartDate: getNextIntervalStartDate(shiftedIntervals, isAllDayIntervals),
  };
};
