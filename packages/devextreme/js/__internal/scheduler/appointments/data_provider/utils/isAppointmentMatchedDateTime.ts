import dateUtils from '@js/core/utils/date';

import type { AppointmentDataItem } from '../../../types';

interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: Date;
  max: Date;
  isOnlyDateCheck: boolean;
}

const toMs = dateUtils.dateToMilliseconds;

export const isAppointmentMatchedDateTime = (appointment: AppointmentDataItem, {
  startDayHour,
  endDayHour,
  min,
  max,
  isOnlyDateCheck,
}: CompareOptions): boolean => {
  const appointmentStart = {
    hours: appointment.startDate.getHours(),
    minutes: appointment.startDate.getMinutes(),
  };
  const appointmentEnd = {
    hours: appointment.endDate.getHours(),
    minutes: appointment.endDate.getMinutes(),
  };

  const trimMin = dateUtils.trimTime(min);
  const trimMax = dateUtils.trimTime(max);
  const trimStartDate = dateUtils.trimTime(appointment.startDate);
  const trimEndDate = dateUtils.trimTime(appointment.endDate);
  const isBetweenOrBiggerThenView = trimEndDate > trimMin && trimStartDate < trimMax;
  const isStartDateBorder = Boolean(dateUtils.sameDate(trimEndDate, trimMin));
  const isEndDateBorder = Boolean(dateUtils.sameDate(trimStartDate, trimMax));

  if (isOnlyDateCheck) {
    return isBetweenOrBiggerThenView || isStartDateBorder || isEndDateBorder;
  }

  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const isAfterMinHours = isStartDateBorder && (
    appointmentEnd.hours > startTime.hours
    || (appointmentEnd.hours === startTime.hours && appointmentEnd.minutes > startTime.minutes)
  );
  const isBeforeMaxHours = isEndDateBorder && (
    appointmentStart.hours < endTime.hours
    || (appointmentStart.hours === endTime.hours && appointmentStart.minutes < endTime.minutes)
  );

  const isLessThenOneDay = appointment.endDate.getTime() - appointment.startDate.getTime() < 24 * toMs('hour');
  const isAfterMaxHours = isLessThenOneDay && (
    appointmentStart.hours > endTime.hours
    || (appointmentStart.hours === endTime.hours && appointmentStart.minutes > endTime.minutes)
  );
  const isBeforeMinHours = isLessThenOneDay && (
    appointmentEnd.hours < startTime.hours
    || (appointmentEnd.hours === startTime.hours && appointmentEnd.minutes < startTime.minutes)
  );
  const isInsideTheGap = isAfterMaxHours && isBeforeMinHours;

  return (isBetweenOrBiggerThenView && !isInsideTheGap) || isAfterMinHours || isBeforeMaxHours;
};
