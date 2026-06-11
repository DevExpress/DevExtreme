import dateUtils from '@js/core/utils/date';

import { globalCache } from '../../../../global_cache';
import timeZoneUtils from '../../../../utils_time_zone';

export interface DateInformation {
  offsetMs: number;
  isUnreachableTime: boolean;
  isDoubleTimeStart: boolean;
  deltaMs: number;
}

const toMs = dateUtils.dateToMilliseconds;
const getOffsetHours = timeZoneUtils.calculateTimezoneByValue;
const HOUR_MS = toMs('hour');
const roundToHour = (date: number): number => Math.round(date / HOUR_MS) * HOUR_MS;

// NOTE: There is cases when DST appears in one month, but it happens in different days,
// so cache it by day. If there is no DST, then it requires 2 offset request,
// if day has DST, then it requires 2 + log2(24*2/3) ~ 7 offset requests
// and 0 offset requests if we already checked this day
export const findDSTOfDay = (date: number, timeZone: string): number[] => {
  const minDate = new Date(date).setUTCHours(0, 0, 0, 0);

  return globalCache.DST.memo(`${minDate}${timeZone}`, () => {
    const min = roundToHour(minDate - HOUR_MS);
    const max = roundToHour(minDate + toMs('day') + HOUR_MS);

    const minOffset = getOffsetHours(timeZone, min) ?? 0;
    const maxOffset = getOffsetHours(timeZone, max) ?? 0;

    if (minOffset === maxOffset) {
      return [-date, minOffset * HOUR_MS, maxOffset * HOUR_MS];
    }

    let left = min;
    let right = max;

    while (right - left > HOUR_MS / 3) {
      const mid = left + (right - left) / 2;
      const offset = getOffsetHours(timeZone, roundToHour(mid));

      if (offset === minOffset) {
        left = mid;
      } else {
        right = mid;
      }
    }

    return [roundToHour(left) + HOUR_MS, minOffset * HOUR_MS, maxOffset * HOUR_MS];
  });
};

export const getDateInformation = (date: number, timeZone: string): DateInformation => {
  const [targetDST, beforeDSTOffset, afterDSTOffset] = findDSTOfDay(date, timeZone);
  const deltaMs = afterDSTOffset - beforeDSTOffset;
  const condition = deltaMs > 0
    ? date < targetDST + deltaMs
    : date < targetDST;

  return {
    offsetMs: condition ? beforeDSTOffset : afterDSTOffset,
    isUnreachableTime: deltaMs > 0 && date >= targetDST && date < targetDST + deltaMs,
    isDoubleTimeStart: date === targetDST,
    deltaMs,
  };
};

export const getDateOffsetMs = (
  date: number,
  timeZone?: string,
): number => (timeZone ? getDateInformation(date, timeZone).offsetMs : 0);
