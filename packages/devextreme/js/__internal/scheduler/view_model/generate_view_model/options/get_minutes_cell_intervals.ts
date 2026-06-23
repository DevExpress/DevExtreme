import { dateUtils } from '@ts/core/utils/m_date';

import timeZoneUtils from '../../../utils_time_zone';
import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  durationMinutes: number;
  skippedDays: number[];
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
}: Options): CellInterval[] => intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const dayIntervals = splitIntervalByDay({
    ...interval, startDayHour, endDayHour, skippedDays,
  });

  let columnIndex = 0;
  filterBySkippedDays(dayIntervals, skippedDays).forEach((dayInterval) => {
    const firstAvailableDayTime = adjustDayIntervalMinForMidnightDST(
      dayInterval.min,
      startDayHour,
    );
    const date = new Date(firstAvailableDayTime);
    while (date.getTime() < dayInterval.max) {
      const min = date.getTime();
      let max = date.setUTCMinutes(date.getUTCMinutes() + durationMinutes);

      if (date.getUTCHours() > endDayHour) {
        date.setUTCDate(date.getUTCDate() + 1);
        date.setUTCHours(startDayHour, 0, 0, 0);
        max = date.getTime();
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
  });

  return result;
}, []);
