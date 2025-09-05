import { getRecurrenceProcessor } from '../../../../m_recurrence';
import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator';
import type { DateInterval } from '../../../../view_model/filtering/utils/type';
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
  const recurrenceProcessor = getRecurrenceProcessor();

  if (!recurrenceProcessor.isValidRecurrenceRule(appointment.recurrenceRule)) {
    return [appointment];
  }

  const appointmentStartDate = new Date(appointment.startDate);
  const appointmentEndDate = new Date(appointment.endDate);
  const recurrenceException = getRecurrenceException(
    appointment.recurrenceException,
    timeZoneCalculator,
  );
  const startDates = recurrenceProcessor.generateDates({
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
