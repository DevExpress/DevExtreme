import type { CellInterval, DateInterval } from '../../types';

export const getMonthCells = (
  monthIntervals: DateInterval[],
): CellInterval[] => monthIntervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
  const date = new Date(interval.min);
  let columnIndex = 0;

  while (date.getTime() < interval.max) {
    const min = date.getTime();
    date.setDate(date.getDate() + 1);
    result.push({
      min,
      max: date.getTime(),
      rowIndex,
      columnIndex,
      cellIndex: result.length,
    });
    columnIndex += 1;
  }

  return result;
}, []);
