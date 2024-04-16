import dateUtils from '@js/core/utils/date';

import type { CalculateStartViewDate } from '../types';
import { getViewStartByOptions, isDataOnWeekend, setOptionHour } from './base';
import { getValidStartDate } from './week';

const MONDAY_INDEX = 1;
const DAYS_IN_WEEK = 7;

export const calculateStartViewDate: CalculateStartViewDate = (
  currentDate,
  startDayHour,
  startDate,
  intervalDuration,
  firstDayOfWeek,
) => {
  const viewStart = getViewStartByOptions(
    startDate,
    currentDate,
    intervalDuration,
    getValidStartDate(startDate, firstDayOfWeek),
  );

  const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
  if (isDataOnWeekend(firstViewDate)) {
    const currentDay = firstViewDate.getDay();
    const distance = (MONDAY_INDEX + DAYS_IN_WEEK - currentDay) % 7;

    firstViewDate.setDate(firstViewDate.getDate() + distance);
  }

  return setOptionHour(firstViewDate, startDayHour);
};
