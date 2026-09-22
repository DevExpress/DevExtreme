import { dateUtils } from '@ts/core/utils/m_date';

import type { DaylightPlan } from '../../../utils/daylight_grid';
import timeZoneUtils from '../../../utils_time_zone';
import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  durationMinutes: number;
  skippedDays: number[];
  daylightPlan?: DaylightPlan;
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
  daylightPlan,
}: Options): CellInterval[] => intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const dayIntervals = splitIntervalByDay({
    ...interval, startDayHour, endDayHour, skippedDays,
  });

  let columnIndex = 0;
  // How far the day being laid out has moved from its nominal place, because earlier
  // days took more or less elapsed time than their wall clock says.
  let shiftMs = 0;
  filterBySkippedDays(dayIntervals, skippedDays).forEach((dayInterval) => {
    const planDay = daylightPlan?.days.find((day) => day.wallStartMs === dayInterval.min);

    if (planDay) {
      let position = dayInterval.min + shiftMs;

      planDay.cells.forEach((cell) => {
        const duration = cell.endUTC - cell.startUTC;

        result.push({
          min: position,
          max: position + duration,
          rowIndex,
          columnIndex,
          cellIndex: result.length,
        });
        position += duration;
        columnIndex += 1;
      });
      shiftMs += planDay.elapsedMs - (dayInterval.max - dayInterval.min);

      return;
    }

    const date = new Date(adjustDayIntervalMinForMidnightDST(dayInterval.min, startDayHour));

    while (date.getTime() < dayInterval.max) {
      const min = date.getTime();
      let max = date.setUTCMinutes(date.getUTCMinutes() + durationMinutes);

      if (date.getUTCHours() > endDayHour) {
        date.setUTCDate(date.getUTCDate() + 1);
        date.setUTCHours(startDayHour, 0, 0, 0);
        max = date.getTime();
      }

      result.push({
        min: min + shiftMs,
        max: max + shiftMs,
        rowIndex,
        columnIndex,
        cellIndex: result.length,
      });
      columnIndex += 1;
    }
  });

  return result;
}, []);
