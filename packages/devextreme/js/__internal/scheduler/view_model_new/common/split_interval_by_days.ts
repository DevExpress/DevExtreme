import { dateUtils } from '@ts/core/utils/m_date';

import type { CompareOptions, DateInterval } from '../types';

export const splitIntervalByDay = ({
  startDayHour,
  endDayHour,
  min,
  max,
}: CompareOptions): DateInterval[] => {
  if (startDayHour >= endDayHour) {
    return [];
  }

  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);

  const normalizedMin = new Date(min);
  normalizedMin.setHours(startTime.hours, startTime.minutes, 0, 0);
  const normalizedMax = new Date(max - 1);
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
