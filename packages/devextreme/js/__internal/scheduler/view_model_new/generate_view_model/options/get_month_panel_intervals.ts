import { getVisibleDateTimeIntervals } from '../../filtration/utils/get_filter_options/get_visible_date_time_intervals';
import { shiftIntervals } from '../../filtration/utils/get_filter_options/shift_intervals';
import type { CompareOptions, DateInterval, DateIntervalsExtended } from '../../types';
import { getNextIntervalStartDate } from './get_next_interval_start_date';
import { getPrevIntervalEndDate } from './get_prev_interval_end_date';

const splitBy7Days = (intervals: DateInterval): DateInterval[] => {
  const result: DateInterval[] = [];
  const date = new Date(intervals.min);

  while (date.getTime() < intervals.max) {
    const min = date.getTime();
    date.setDate(date.getDate() + 7);
    result.push({ min, max: date.getTime() });
  }

  return result;
};

export const getMonthPanelIntervals = (
  compareOptions: CompareOptions,
  viewOffset: number,
): DateIntervalsExtended => {
  const intervals = getVisibleDateTimeIntervals(compareOptions, true);
  const intervalsBy7Days = splitBy7Days(intervals[0]);
  const shiftedIntervals = shiftIntervals(intervalsBy7Days, viewOffset);

  return {
    intervals: shiftedIntervals,
    prevIntervalEndDate: getPrevIntervalEndDate(shiftedIntervals, true),
    nextIntervalStartDate: getNextIntervalStartDate(shiftedIntervals, true),
  };
};
