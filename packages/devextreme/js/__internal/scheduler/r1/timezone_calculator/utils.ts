import timeZoneUtils from '../../utils_time_zone';
import { TimeZoneCalculator } from './calculator';

export const createTimeZoneCalculator = (
  currentTimeZone: string,
): TimeZoneCalculator => new TimeZoneCalculator({
  timeZone: currentTimeZone,
  getClientOffset: (date: Date): number => timeZoneUtils
    .getClientTimezoneOffset(date),
  tryGetCommonOffset: (date: Date): number | undefined => timeZoneUtils
    .calculateTimezoneByValue(currentTimeZone, date),
  tryGetAppointmentOffset: (
    date: Date,
    appointmentTimezone?: string,
  ): number | undefined => timeZoneUtils.calculateTimezoneByValue(
    appointmentTimezone,
    date,
  ),
});
