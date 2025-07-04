import { dateUtils } from '@ts/core/utils/m_date';

import { getVisibleRecurrenceInterval } from './getVisibleRecurrenceInterval';
import type { CompareOptions, DateInterval } from './type';

const toMs = dateUtils.dateToMilliseconds;

export const getVisibleDateIntervals = (options: CompareOptions): DateInterval[] => {
  const { min, max } = getVisibleRecurrenceInterval(options);
  const {
    startDayHour,
    endDayHour,
    isOnlyDateCheck,
  } = options;

  if (isOnlyDateCheck || (startDayHour === 0 && endDayHour === 24)) {
    return [{ min, max }];
  }

  if (startDayHour >= endDayHour) {
    return [];
  }

  let time = min.getTime();
  const maxTime = max.getTime();
  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
  const result: DateInterval[] = [];

  while (time < maxTime) {
    const intervalMax = new Date(time);
    intervalMax.setHours(endTime.hours, endTime.minutes, 0, 0);

    result.push({
      min: new Date(time),
      max: intervalMax,
    });
    time += 24 * toMs('hour');
  }

  return result;
};
