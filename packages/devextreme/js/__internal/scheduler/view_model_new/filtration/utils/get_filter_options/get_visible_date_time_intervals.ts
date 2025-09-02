import { splitIntervalByDay } from '../../../common/split_interval_by_days';
import { trimInterval } from '../../../common/trim_interval';
import type { CompareOptions, DateInterval } from '../../../types';

export const getVisibleDateTimeIntervals = ({
  startDayHour,
  endDayHour,
  min,
  max,
}: CompareOptions, isDateViewOnly: boolean): DateInterval[] => {
  if (isDateViewOnly || (startDayHour === 0 && endDayHour === 24)) {
    return [trimInterval({ min, max })];
  }

  return splitIntervalByDay({
    startDayHour,
    endDayHour,
    min,
    max,
  });
};
