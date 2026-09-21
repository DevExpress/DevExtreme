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
  stretchFallBackDays?: boolean;
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
  stretchFallBackDays = false,
}: Options): { cells: CellInterval[]; fallBackShiftMs: number } => {
  let fallBackShiftMs = 0;
  const cells = intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
    const dayIntervals = splitIntervalByDay({
      ...interval, startDayHour, endDayHour, skippedDays,
    });

    let columnIndex = 0;
    let intervalFallBackShiftMs = 0;
    filterBySkippedDays(dayIntervals, skippedDays).forEach((dayInterval) => {
      const dayFallBackShiftMs = stretchFallBackDays
        ? timeZoneUtils.getLocalFallBackShiftInWallClockRange(
          dayInterval.min,
          dayInterval.max,
        )
        : 0;
      const firstAvailableDayTime = adjustDayIntervalMinForMidnightDST(
        dayInterval.min,
        startDayHour,
      ) + intervalFallBackShiftMs;
      const dayMax = dayInterval.max + intervalFallBackShiftMs + dayFallBackShiftMs;
      const date = new Date(firstAvailableDayTime);
      while (date.getTime() < dayMax) {
        const min = date.getTime();
        let max = date.setUTCMinutes(date.getUTCMinutes() + durationMinutes);

        if (date.getUTCHours() > endDayHour) {
          date.setUTCDate(date.getUTCDate() + 1);
          date.setUTCHours(startDayHour, 0, 0, 0);
          max = date.getTime();
        }

        // NOTE: A fall-back that is not divisible by the cell duration would
        // otherwise let the last cell of the day overlap the next day's first cell.
        if (max > dayMax) {
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
      intervalFallBackShiftMs += dayFallBackShiftMs;
      fallBackShiftMs += dayFallBackShiftMs;
    });

    return result;
  }, []);

  return { cells, fallBackShiftMs };
};
