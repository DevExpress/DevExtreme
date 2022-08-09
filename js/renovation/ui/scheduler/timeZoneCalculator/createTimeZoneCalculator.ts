import { TimeZoneCalculator } from './utils';
import timeZoneUtils from '../../../../ui/scheduler/utils.timeZone';

export const createTimeZoneCalculator = (
  currentTimeZone: string,
): TimeZoneCalculator => new TimeZoneCalculator({
  timeZone: currentTimeZone,
  getClientOffset: (date: Date): number => timeZoneUtils.getClientTimezoneOffset(date),
  getCommonOffset: (
    date: Date,
  ): number => timeZoneUtils.calculateTimezoneByValue(currentTimeZone, date) as number,
  getAppointmentOffset: (
    date: Date,
    appointmentTimezone?: string,
  ): number => timeZoneUtils.calculateTimezoneByValue(
    appointmentTimezone,
    date,
  ) as number,
});
