import dateUtils from '../../../../../../../core/utils/date';
import { CalculateStartViewDate } from '../types';
import { setOptionHour } from './base';
import { getViewStartByOptions } from './month';

export const calculateStartViewDate: CalculateStartViewDate = (
  currentDate, startDayHour, startDate, intervalCount,
) => {
  const firstViewDate = dateUtils.getFirstMonthDate(getViewStartByOptions(
    startDate,
    currentDate,
    intervalCount,
    dateUtils.getFirstMonthDate(startDate) as Date,
  )) as Date;

  return setOptionHour(firstViewDate, startDayHour);
};
