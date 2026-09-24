import type { DaylightPlan } from '../../../utils/daylight_grid';
import type { VerticalSlot } from '../../../workspaces/view_model/view_data_generator';
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
  verticalSlots?: VerticalSlot[],
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
    daylightPlan,
    verticalSlots: isTimeline ? undefined : verticalSlots,
    viewOffset,
  });
  // Vertical rows already start at the offset hour. Shifting their layout
  // again puts the appointment on a different row from its label.
  const shiftedCells = shiftIntervals(cells, verticalSlots ? 0 : viewOffset);

  return {
    cells: shiftedCells,
    dayIntervals: shiftedSplitIntervals,
    intervals: shiftedIntervals,
  };
};
