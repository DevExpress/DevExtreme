import { dateUtils } from '@ts/core/utils/m_date';

import { getDatesWithoutTime } from '../../../r1/utils/index';
import type { CompareOptions, DateInterval } from './type';

const toMs = dateUtils.dateToMilliseconds;

export const getVisibleDateTimeIntervals = ({
  startDayHour,
  endDayHour,
  min,
  max,
}: CompareOptions, isDateViewOnly: boolean): DateInterval[] => {
  if (isDateViewOnly || (startDayHour === 0 && endDayHour === 24)) {
    const [trimMin, trimMax] = getDatesWithoutTime(min, max);

    return [{ min: trimMin, max: trimMax }];
  }

  if (startDayHour >= endDayHour) {
    return [];
  }

  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);

  const normalizedMin = dateUtils.trimTime(min) as Date;
  normalizedMin.setHours(startTime.hours, startTime.minutes, 0, 0);
  const normalizedMax = dateUtils.trimTime(max) as Date;
  normalizedMax.setHours(endTime.hours, endTime.minutes, 0, 0);

  let time = normalizedMin.getTime();
  const maxTime = normalizedMax.getTime();
  const result: DateInterval[] = [];

  while (time < maxTime) {
    const intervalMax = new Date(time);
    intervalMax.setHours(endTime.hours, endTime.minutes, 0, 0);

    result.push({
      min: new Date(time),
      max: intervalMax,
    });
    time += toMs('day');
  }

  return result;
};
