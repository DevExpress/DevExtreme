import { dateUtils } from '@ts/core/utils/m_date';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator/calculator';
import { buildFallbackDayCells } from '../../../utils/repeated_hour';
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
  timeZoneCalculator?: TimeZoneCalculator;
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
  timeZoneCalculator,
}: Options): CellInterval[] => intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const dayIntervals = splitIntervalByDay({
    ...interval, startDayHour, endDayHour, skippedDays,
  });

  let columnIndex = 0;
  let fallbackShiftMs = 0;
  const cellDurationMs = durationMinutes * toMs('minute');
  filterBySkippedDays(dayIntervals, skippedDays).forEach((dayInterval) => {
    const localDay = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(dayInterval.min));
    const fallbackCells = stretchRepeatedHour
      ? buildFallbackDayCells(
        localDay,
        startDayHour,
        endDayHour,
        cellDurationMs,
        timeZoneCalculator,
      )
      : undefined;
    const dayStart = adjustDayIntervalMinForMidnightDST(dayInterval.min, startDayHour);

    if (fallbackCells) {
      let position = dayStart + fallbackShiftMs;
      fallbackCells.forEach((cell) => {
        const duration = cell.end.getTime() - cell.start.getTime();
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
      fallbackShiftMs += (position - dayStart - fallbackShiftMs) - (dayInterval.max - dayStart);
    } else {
      const date = new Date(dayStart);
      while (date.getTime() < dayInterval.max) {
        const min = date.getTime();
        let max = date.setUTCMinutes(date.getUTCMinutes() + durationMinutes);

        if (date.getUTCHours() > endDayHour) {
          date.setUTCDate(date.getUTCDate() + 1);
          date.setUTCHours(startDayHour, 0, 0, 0);
          max = date.getTime();
        }

        result.push({
          min: min + fallbackShiftMs,
          max: max + fallbackShiftMs,
          rowIndex,
          columnIndex,
          cellIndex: result.length,
        });
        columnIndex += 1;
      }
    }
  });

  return result;
}, []);
