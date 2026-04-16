import dateUtils from '@js/core/utils/date';

import { getFirstVisibleDate } from '../../utils/skipped_days';
import { getViewStartByOptions, setOptionHour } from './base';
import { getValidStartDate } from './week';

export const calculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
  startDate: Date,
  intervalDuration: number,
  firstDayOfWeek: number | undefined,
  skippedDays: number[] = [0, 6],
): Date => {
  const viewStart = getViewStartByOptions(
    startDate,
    currentDate,
    intervalDuration,
    getValidStartDate(startDate, firstDayOfWeek),
  );

  const firstViewDate = getFirstVisibleDate(
    dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek),
    skippedDays,
    (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
  );

  return setOptionHour(firstViewDate, startDayHour);
};
