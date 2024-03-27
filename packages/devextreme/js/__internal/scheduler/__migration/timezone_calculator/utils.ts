import timeZoneUtils from '../../m_utils_time_zone';
import { TimeZoneCalculator } from './calculator';

export const createTimeZoneCalculator = (
  currentTimeZone: string,
): TimeZoneCalculator => new TimeZoneCalculator({
  getClientOffset: (date: Date): number => timeZoneUtils
    .getClientTimezoneOffset(date),
  tryGetCommonOffset: (date: Date): number | undefined => timeZoneUtils
    .calculateTimezoneByValue(currentTimeZone, date) as (number | undefined),
  tryGetAppointmentOffset: (
    date: Date,
    appointmentTimezone?: string,
  ): number => timeZoneUtils.calculateTimezoneByValue(
    appointmentTimezone,
    date,
  ) as number,
});
