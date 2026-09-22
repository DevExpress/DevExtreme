import type { DaylightPlan } from '../../../utils/daylight_grid';
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
  daylightPlan?: DaylightPlan,
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
    daylightPlan: isTimeline ? daylightPlan : undefined,
  });
  const shiftedCells = shiftIntervals(cells, viewOffset);
  // NOTE: A day that repeats an hour pushes the cells after it past the nominal end of
  // the view, so the interval an appointment is matched against has to follow them.
  const lastCellMax = shiftedCells[shiftedCells.length - 1]?.max;
  const coveredIntervals = daylightPlan && isTimeline && lastCellMax !== undefined
    ? shiftedIntervals.map((interval) => ({
      ...interval,
      max: Math.max(interval.max, lastCellMax),
    }))
    : shiftedIntervals;

  return {
    cells: shiftedCells,
    dayIntervals: shiftedSplitIntervals,
    intervals: coveredIntervals,
  };
};
