import { dateUtilsTs } from '@ts/core/utils/date';

import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator';
import { generateDates } from '../../../../recurrence/generate_dates';
import { validateRRule } from '../../../../recurrence/validate_rule';
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
  if (!validateRRule(appointment.recurrenceRule)) {
    return [appointment];
  }

  const recurrenceException = getRecurrenceException(
    appointment.recurrenceException,
    appointment.startDate,
    timeZoneCalculator,
  );
  const startDates = generateDates({
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
