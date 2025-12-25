import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  skippedDays: number[];
  cellInterval?: number;
}

export const getOneDayCellIntervals = ({
  intervals,
  startDayHour,
  endDayHour,
  skippedDays,
  cellInterval = 1,
}: Options): CellInterval[] => intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const cells = splitIntervalByDay({
    ...interval, startDayHour, endDayHour, skippedDays, cellInterval,
  });

  let columnIndex = 0;
  cells.forEach((cell) => {
    result.push({
      min: cell.min,
      max: cell.max,
      rowIndex,
      columnIndex,
      cellIndex: result.length,
    });
    columnIndex += 1;
  });

  return result;
}, []);
