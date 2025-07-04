import { dateUtils } from '@ts/core/utils/m_date';

import { getDatesWithoutTime } from '../../../r1/utils/index';
import type { CompareOptions, DateInterval } from './type';

export const getVisibleRecurrenceInterval = ({
  startDayHour,
  endDayHour,
  min,
  max,
  isOnlyDateCheck,
}: CompareOptions): DateInterval => {
  if (isOnlyDateCheck || (startDayHour === 0 && endDayHour === 24)) {
    const [trimMin, trimMax] = getDatesWithoutTime(min, max);

    return { min: trimMin, max: trimMax };
  }

  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
  const normalizedMin = dateUtils.trimTime(min) as Date;
  normalizedMin.setHours(startTime.hours, startTime.minutes, 0, 0);
  const normalizedMax = dateUtils.trimTime(max) as Date;
  normalizedMax.setHours(endTime.hours, endTime.minutes, 0, 0);

  return { min: normalizedMin, max: normalizedMax };
};
