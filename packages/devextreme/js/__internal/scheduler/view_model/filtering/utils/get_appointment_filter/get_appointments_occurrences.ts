import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator';
import { generateDates } from '../../../../recurrence/generate_dates';
import { validateRRule } from '../../../../recurrence/validate_rule';
import type { DateInterval } from '../../../../view_model_new/types';
import { getRecurrenceException } from './get_recurrence_exception';

interface Options {
  firstDayOfWeek?: number;
  interval: DateInterval;
}
interface AppointmentData {
  startDate: number;
  startDateTimeZone?: string;
  endDate: number;
  endDateTimeZone?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
}

export const getAppointmentRecurrenceOccurrences = <T extends AppointmentData>(
  appointment: T,
  {
    firstDayOfWeek,
    interval,
  }: Options,
  timeZoneCalculator: TimeZoneCalculator,
): T[] => {
  if (!validateRRule(appointment.recurrenceRule)) {
    return [appointment];
  }

  const appointmentStartDate = new Date(appointment.startDate);
  const appointmentEndDate = new Date(appointment.endDate);
  const recurrenceException = getRecurrenceException(
    appointment.recurrenceException,
    timeZoneCalculator,
  );
  const startDates = generateDates({
    rule: appointment.recurrenceRule,
    exception: recurrenceException,
    start: appointmentStartDate,
    end: appointmentEndDate,
    min: new Date(interval.min),
    max: new Date(interval.max),
    firstDayOfWeek,
    appointmentTimezoneOffset: timeZoneCalculator.getOriginStartDateOffsetInMs(
      appointmentStartDate,
      appointment.startDateTimeZone,
      false,
    ),
  });
  const duration = appointmentEndDate.getTime() - appointmentStartDate.getTime();

  return startDates.map((startDate) => ({
    ...appointment,
    startDate: startDate.getTime(),
    endDate: startDate.getTime() + duration,
  }));
};
