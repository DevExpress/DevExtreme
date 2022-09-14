import { IDateRange } from './types';
import { convertUTCDate, TConvertDirection } from './convertUTCDate';
import dateUtils from '../../../../../core/utils/date';

const getAllDayAppointmentDateRange = (
  startDate: Date,
  endDate: Date,
  datesInUTC: boolean,
  direction: TConvertDirection,
): IDateRange => {
  let resultStartDate = startDate;
  let resultEndDate = endDate;

  if (datesInUTC) {
    const trimmedStartDate = dateUtils.trimTime(startDate) as Date;
    const trimmedEndDate = dateUtils.trimTime(endDate) as Date;
    const dayCount = Math.floor(
      (trimmedEndDate.getTime() - trimmedStartDate.getTime()) / dateUtils.dateToMilliseconds('day'),
    );
    resultStartDate = dateUtils.trimTime(convertUTCDate(startDate, direction)) as Date;
    resultEndDate = dayCount > 0
      ? new Date(resultStartDate.getTime() + dayCount * dateUtils.dateToMilliseconds('day'))
      : dateUtils.setToDayEnd(resultStartDate);
  }

  return {
    startDate: resultStartDate,
    endDate: resultEndDate,
  };
};

export default getAllDayAppointmentDateRange;
