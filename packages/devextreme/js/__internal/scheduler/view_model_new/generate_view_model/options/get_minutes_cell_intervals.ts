import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  durationMinutes: number;
  skippedDays: number[];
}

const filterBySkippedDays = <T extends DateInterval>(
  intervals: T[],
  skippedDays: number[],
): T[] => intervals.filter((item) => !skippedDays.includes(new Date(item.min).getDay()));

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
      let max = date.setMinutes(date.getMinutes() + durationMinutes);

      if (date.getHours() > endDayHour) {
        date.setDate(date.getDate() + 1);
        date.setHours(startDayHour, 0, 0, 0);
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
