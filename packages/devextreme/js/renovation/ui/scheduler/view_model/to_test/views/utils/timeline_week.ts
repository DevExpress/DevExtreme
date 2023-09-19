import timeZoneUtils from '../../../../../../../__internal/scheduler/m_utils_time_zone';
import { GetDateForHeaderText } from '../types';
import { getStartViewDateWithoutDST } from './base';

export const getDateForHeaderText: GetDateForHeaderText = (index, date, options) => {
  if (!timeZoneUtils.isTimezoneChangeInDate(date)) {
    return date;
  }

  const {
    startDayHour,
    startViewDate,
    cellCountInDay,
    interval,
  } = options;

  const result = getStartViewDateWithoutDST(startViewDate, startDayHour);

  const validIndex = index % cellCountInDay;
  result.setTime(result.getTime() + validIndex * interval);

  return result;
};
