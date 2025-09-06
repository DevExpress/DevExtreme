import { splitIntervalByDay } from '../../../common/split_interval_by_days';
import type { CompareOptions, DateInterval } from '../../../types';

export const getVisibleDateTimeIntervals = ({
  startDayHour,
  endDayHour,
  min,
  max,
  skippedDays,
}: CompareOptions, isDateViewOnly: boolean): DateInterval[] => {
  if (isDateViewOnly || (startDayHour === 0 && endDayHour === 24)) {
    return splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min,
      max,
      skippedDays,
    });
  }

  return splitIntervalByDay({
    startDayHour,
    endDayHour,
    min,
    max,
    skippedDays,
  });
};
