import { getVisibleDateTimeIntervals } from '../../filtration/utils/get_filter_options/get_visible_date_time_intervals';
import { shiftIntervals } from '../../filtration/utils/get_filter_options/shift_intervals';
import type { CompareOptions, DateIntervalsExtended } from '../../types';
import { getNextIntervalStartDate } from './get_next_interval_start_date';
import { getPrevIntervalEndDate } from './get_prev_interval_end_date';

export const getPanelIntervals = (
  compareOptions: CompareOptions,
  viewOffset: number,
  isAllDayPanel: boolean,
  isSplitByDays: boolean,
): DateIntervalsExtended => {
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
