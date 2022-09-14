import { PathTimeZoneConversion } from '../../timeZoneCalculator/types';
import { TimeZoneCalculator } from '../../timeZoneCalculator/utils';
import { IDateRange } from './types';
import getAllDayAppointmentDateRange from './getAllDayAppointmentDateRange';

const getSimpleAppointmentDateRange = (
  startDate: Date,
  endDate: Date,
  timeZoneCalculator: TimeZoneCalculator,
): IDateRange => ({
  startDate: timeZoneCalculator.createDate(
    startDate, { path: PathTimeZoneConversion.fromSourceToGrid },
  ) as Date,
  endDate: timeZoneCalculator.createDate(
    endDate, { path: PathTimeZoneConversion.fromSourceToGrid },
  ) as Date,
});

const getAppointmentDateRange = (
  startDate: Date,
  endDate: Date,
  allDay: boolean,
  datesInUTC: boolean,
  timeZoneCalculator: TimeZoneCalculator,
): IDateRange => (allDay
  ? getAllDayAppointmentDateRange(startDate, endDate, datesInUTC, 'toUtc')
  : getSimpleAppointmentDateRange(startDate, endDate, timeZoneCalculator));

export default getAppointmentDateRange;
