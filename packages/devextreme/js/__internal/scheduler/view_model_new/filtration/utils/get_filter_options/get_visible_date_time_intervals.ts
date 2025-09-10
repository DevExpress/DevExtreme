import { splitIntervalByDay } from '../../../common/split_interval_by_days';
import type { CompareOptions, DateInterval } from '../../../types';

const mergeIntervalsWithoutGap = (intervals: DateInterval[]): DateInterval[] => {
  if (intervals.length === 0) return [];

  return intervals.reduce<DateInterval[]>((result, interval) => {
    const last = result[result.length - 1];
    if (last.max === interval.min) {
      last.max = interval.max;
      return result;
    }

    result.push(interval);
    return result;
  }, [{ min: intervals[0].min, max: intervals[0].min }]);
};

export const getVisibleDateTimeIntervals = ({
  startDayHour,
  endDayHour,
  min,
  max,
  skippedDays,
}: CompareOptions, isDateViewOnly: boolean): DateInterval[] => {
  if (isDateViewOnly || (startDayHour === 0 && endDayHour === 24)) {
    return mergeIntervalsWithoutGap(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min,
      max,
      skippedDays,
    }));
  }

  return splitIntervalByDay({
    startDayHour,
    endDayHour,
    min,
    max,
    skippedDays,
  });
};
