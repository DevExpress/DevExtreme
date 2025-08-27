import { dateUtils } from '@ts/core/utils/m_date';

import { getDatesWithoutTime } from '../../../../r1/utils/base';
import type { CompareOptions, DateInterval } from '../../../types';

export const getVisibleDateTimeIntervals = ({
  startDayHour,
  endDayHour,
  min,
  max,
}: CompareOptions, isDateViewOnly: boolean, isSplitByDays = false): DateInterval[] => {
  if (isDateViewOnly || (!isSplitByDays && (startDayHour === 0 && endDayHour === 24))) {
    const [trimMin, trimMax] = getDatesWithoutTime(min, max);

    return [{ min: trimMin.getTime(), max: trimMax.getTime() }];
  }

  if (startDayHour >= endDayHour) {
    return [];
  }

  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);

  const normalizedMin = new Date(min);
  normalizedMin.setHours(startTime.hours, startTime.minutes, 0, 0);
  const normalizedMax = new Date(max);
  normalizedMax.setHours(endTime.hours, endTime.minutes, 0, 0);

  const time = normalizedMin;
  const maxTime = normalizedMax;
  const result: DateInterval[] = [];

  while (time < maxTime) {
    const intervalMax = new Date(time);
    intervalMax.setHours(endTime.hours, endTime.minutes, 0, 0);

    result.push({
      min: time.getTime(),
      max: intervalMax.getTime(),
    });
    time.setDate(time.getDate() + 1);
  }

  return result;
};
