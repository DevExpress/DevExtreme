import type { TimeZoneCalculator } from '../../../r1/timezone_calculator/calculator';
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
  timeZoneCalculator?: TimeZoneCalculator,
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
    stretchRepeatedHour: isTimeline,
    timeZoneCalculator,
  });
  const shiftedCells = shiftIntervals(cells, viewOffset);
  const lastCellMax = shiftedCells.length > 0
    ? shiftedCells[shiftedCells.length - 1].max
    : undefined;
  const coveredIntervals = isTimeline
    ? shiftedIntervals.map((interval) => ({
      ...interval,
      max: lastCellMax === undefined ? interval.max : Math.max(interval.max, lastCellMax),
    }))
    : shiftedIntervals;

  return {
    cells: shiftedCells,
    dayIntervals: shiftedSplitIntervals,
    intervals: coveredIntervals,
  };
};
