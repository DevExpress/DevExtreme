import { dateUtils } from '@ts/core/utils/m_date';

import { getVisibleFallbackMs } from '../../../utils/repeated_hour';
import timeZoneUtils from '../../../utils_time_zone';
import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  durationMinutes: number;
  skippedDays: number[];
  stretchRepeatedHour?: boolean;
}

const toMs = dateUtils.dateToMilliseconds;

const filterBySkippedDays = <T extends DateInterval>(
  intervals: T[],
  skippedDays: number[],
): T[] => intervals.filter((item) => {
  const weekday = new Date(item.min).getUTCDay();
  return !skippedDays.includes(weekday);
});

const adjustDayIntervalMinForMidnightDST = (
  dayIntervalMin: number,
  startDayHour: number,
): number => {
  const date = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(dayIntervalMin));
  const isMidnightDST = startDayHour === 0 && timeZoneUtils.isLocalTimeMidnightDST(date);

  return isMidnightDST
    ? dayIntervalMin + date.getHours() * toMs('hour')
    : dayIntervalMin;
};

export const getMinutesCellIntervals = ({
  intervals,
  startDayHour,
  endDayHour,
  durationMinutes,
  skippedDays,
  stretchRepeatedHour = false,
}: Options): CellInterval[] => intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const dayIntervals = splitIntervalByDay({
    ...interval, startDayHour, endDayHour, skippedDays,
  });

  let columnIndex = 0;
  let carriedShiftMs = 0;
  filterBySkippedDays(dayIntervals, skippedDays).forEach((dayInterval) => {
    const localDay = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(dayInterval.min));
    const repeatedHourMs = stretchRepeatedHour
      ? getVisibleFallbackMs(localDay, startDayHour, endDayHour)
      : 0;
    const firstAvailableDayTime = adjustDayIntervalMinForMidnightDST(
      dayInterval.min,
      startDayHour,
    ) + carriedShiftMs;
    const dayMax = dayInterval.max + carriedShiftMs + repeatedHourMs;
    const date = new Date(firstAvailableDayTime);
    while (date.getTime() < dayMax) {
      const min = date.getTime();
      let max = date.setUTCMinutes(date.getUTCMinutes() + durationMinutes);

      const stretchesDay = repeatedHourMs > 0 || carriedShiftMs > 0;
      if (!stretchesDay && date.getUTCHours() > endDayHour) {
        date.setUTCDate(date.getUTCDate() + 1);
        date.setUTCHours(startDayHour, 0, 0, 0);
        max = date.getTime();
      }

      if (stretchesDay && max > dayMax) {
        max = dayMax;
        date.setTime(dayMax);
      }

      result.push({
        min,
        max,
        rowIndex,
        columnIndex,
        cellIndex: result.length,
      });
      columnIndex += 1;
    }
    carriedShiftMs += repeatedHourMs;
  });

  return result;
}, []);
