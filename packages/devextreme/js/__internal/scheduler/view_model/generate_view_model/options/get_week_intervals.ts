import { shiftIntervals } from '../../common/shift_intervals';
import { splitIntervalByDay } from '../../common/split_interval_by_days';
import { trimInterval } from '../../common/trim_interval';
import type { CompareOptions, LayoutIntervals } from '../../types';
import { getMinutesCellIntervals } from './get_minutes_cell_intervals';

export const getWeekIntervals = (
  compareOptions: CompareOptions,
  cellDurationMinutes: number,
  viewOffset: number,
  isTimeline: boolean,
): LayoutIntervals => {
  const { startDayHour, endDayHour, ...dateInterval } = compareOptions;
  const trimmedInterval = trimInterval(dateInterval);
  const splitIntervals = splitIntervalByDay(compareOptions);
  const intervals = isTimeline ? [trimmedInterval] : splitIntervals;
  const shiftedIntervals = shiftIntervals(intervals, viewOffset);
  const shiftedSplitIntervals = shiftIntervals(splitIntervals, viewOffset);

  const cells = getMinutesCellIntervals({
    ...compareOptions,
    intervals,
    durationMinutes: cellDurationMinutes,
  });
  const shiftedCells = shiftIntervals(cells, viewOffset);

  return {
    cells: shiftedCells,
    dayIntervals: shiftedSplitIntervals,
    intervals: shiftedIntervals,
  };
};
