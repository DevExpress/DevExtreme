import { dateUtilsTs } from '@ts/core/utils/date';

import { getRecurrenceProcessor } from '../../../../m_recurrence';
import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator';
import type { AppointmentDataItem } from '../../../../types';
import type { DateInterval } from '../type';
import { getRecurrenceException } from './get_recurrence_exception';

interface Options {
  firstDayOfWeek: number;
  interval: DateInterval;
}

export const getAppointmentsOccurrences = (
  appointment: AppointmentDataItem,
  {
    firstDayOfWeek,
    interval,
  }: Options,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentDataItem[] => {
  const recurrenceProcessor = getRecurrenceProcessor();

  if (!recurrenceProcessor.isValidRecurrenceRule(appointment.recurrenceRule)) {
    return [appointment];
  }

  const recurrenceException = getRecurrenceException(
    appointment.recurrenceException,
    appointment.startDate,
    timeZoneCalculator,
  );
  const startDates = recurrenceProcessor.generateDates({
    rule: appointment.recurrenceRule,
    exception: recurrenceException,
    start: appointment.startDate,
    end: appointment.endDate,
    min: interval.min,
    max: interval.max,
    firstDayOfWeek,
    appointmentTimezoneOffset: timeZoneCalculator.getOriginStartDateOffsetInMs(
      appointment.startDate,
      appointment.startDateTimeZone,
      false,
    ),
  });
  const duration = appointment.endDate.getTime() - appointment.startDate.getTime();

  return startDates.map((startDate) => ({
    ...appointment,
    startDate,
    endDate: dateUtilsTs.addOffsets(startDate, duration),
  }));
};
