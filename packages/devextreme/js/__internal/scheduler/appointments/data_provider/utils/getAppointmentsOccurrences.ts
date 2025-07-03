import { dateUtilsTs } from '@ts/core/utils/date';

import { getRecurrenceProcessor } from '../../../m_recurrence';
import type { TimeZoneCalculator } from '../../../r1/timezone_calculator';
import { getDatesWithoutTime } from '../../../r1/utils';
import type { AppointmentDataItem } from '../../../types';
import { getRecurrenceException } from './getRecurrenceException';

interface Options {
  firstDayOfWeek: number;
  min: Date;
  max: Date;
  isTimeDateView: boolean;
}

const correctDateTime = (min: Date, max: Date): Date[] => {
  const [trimMin, trimMax] = getDatesWithoutTime(min, max);

  return [
    trimMin,
    new Date(trimMax.getTime() - 1000),
  ];
};

export const getAppointmentsOccurrences = (
  appointment: AppointmentDataItem,
  {
    firstDayOfWeek,
    min,
    max,
    isTimeDateView,
  }: Options,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentDataItem[] => {
  const recurrenceProcessor = getRecurrenceProcessor();

  if (!recurrenceProcessor.isValidRecurrenceRule(appointment.recurrenceRule)) {
    return [appointment];
  }

  const [fixedMin, fixedMax] = !isTimeDateView || appointment.allDay
    ? correctDateTime(min, max)
    : [min, max];
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
    min: fixedMin,
    max: fixedMax,
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
    endDate: dateUtilsTs.addOffsets(startDate, [duration]),
  }));
};
