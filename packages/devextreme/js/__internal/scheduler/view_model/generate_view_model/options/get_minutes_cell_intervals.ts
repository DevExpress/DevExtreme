import type { WeekdayIndex } from '@ts/scheduler/utils/skipped_days';

import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  durationMinutes: number;
  skippedDays: WeekdayIndex[];
}

const filterBySkippedDays = <T extends DateInterval>(
  intervals: T[],
  skippedDays: WeekdayIndex[],
): T[] => intervals.filter((item) => {
  const weekday = new Date(item.min).getUTCDay() as WeekdayIndex;
  return !skippedDays.includes(weekday);
});

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
    const date = new Date(dayInterval.min);
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
