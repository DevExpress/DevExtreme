import { dateUtils } from '@ts/core/utils/m_date';

import type { CompareOptions, DateInterval } from '../types';

export const splitIntervalByDay = ({
  startDayHour,
  endDayHour,
  min,
  max,
  skippedDays,
}: CompareOptions): DateInterval[] => {
  if (endDayHour < startDayHour) {
    return [];
  }

  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);

  const normalizedMin = new Date(min);
  normalizedMin.setUTCHours(startTime.hours, startTime.minutes, 0, 0);
  const normalizedMax = new Date(max - 1);
  normalizedMax.setUTCHours(endTime.hours, endTime.minutes, 0, 0);

  const time = normalizedMin;
  const maxTime = normalizedMax;
  const result: DateInterval[] = [];

  while (time < maxTime) {
    if (!skippedDays.includes(time.getUTCDay())) {
      const intervalMax = new Date(time);
      intervalMax.setUTCHours(endTime.hours, endTime.minutes, 0, 0);

      result.push({
        min: time.getTime(),
        max: intervalMax.getTime(),
      });
    }

    time.setUTCDate(time.getUTCDate() + 1);
  }

  return result;
};
