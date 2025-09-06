import { filterBySkippedDays } from '../../common/filter_by_skipped_days';
import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  skippedDays: number[];
}

export const getOneDayCellIntervals = ({
  intervals,
  startDayHour,
  endDayHour,
  skippedDays,
}: Options): CellInterval[] => intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const cells = splitIntervalByDay({
    ...interval, startDayHour, endDayHour, skippedDays,
  });

  let columnIndex = 0;
  filterBySkippedDays(cells, skippedDays).forEach((cell) => {
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
