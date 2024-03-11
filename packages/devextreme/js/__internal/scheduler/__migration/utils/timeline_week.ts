import type { GetDateForHeaderText } from '../types';
import { getValidCellDateForLocalTimeFormat } from './base';

export const getDateForHeaderText: GetDateForHeaderText = (
  index,
  date,
  {
    startDayHour,
    startViewDate,
    cellCountInDay,
    interval,
    viewOffset,
  },
) => getValidCellDateForLocalTimeFormat(date, {
  startViewDate,
  startDayHour,
  cellIndexShift: (index % cellCountInDay) * interval,
  viewOffset,
});
