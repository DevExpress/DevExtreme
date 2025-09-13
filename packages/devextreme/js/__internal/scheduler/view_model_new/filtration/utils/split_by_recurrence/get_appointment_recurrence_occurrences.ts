import { getDateByAsciiString } from '../../../../recurrence/base';
import type { DateInterval, MinimalAppointmentEntity } from '../../../types';
import { generateRecurrenceUTCDates } from './generate_recurrence_utc_dates';
import type { DateInformation } from './get_date_information';
import { getDateInformation, getDateOffsetMs } from './get_date_information';

interface Options {
  firstDayOfWeek?: number;
  timeZone: string;
  interval: DateInterval;
}

// NOTE: When DST+1, then 2 AM equal 3 AM and interval [2 AM, 3 AM) is unreachable
const getUnreachableShift = (
  startDateInfo: DateInformation,
  endDateInfo: DateInformation,
): number[] => {
  switch (true) {
    case startDateInfo.isUnreachable:
      return [startDateInfo.deltaMs, startDateInfo.deltaMs];
    case endDateInfo.isUnreachable:
      return [0, endDateInfo.deltaMs];
    default:
      return [0, 0];
  }
};

export const getAppointmentRecurrenceOccurrences = <T extends MinimalAppointmentEntity >(
  appointment: T,
  {
    firstDayOfWeek,
    timeZone,
    interval,
  }: Options,
): T[] => {
  const {
    startDateUTC, endDateUTC, startDateTimeZone, endDateTimeZone,
  } = appointment;
  const duration = endDateUTC - startDateUTC;
  const startDateOffsetBase = getDateOffsetMs(startDateUTC, timeZone);
  const dates = generateRecurrenceUTCDates(appointment, {
    firstDayOfWeek,
    interval,
    startDateOffsetBase,
  });

  if (!appointment.hasRecurrenceRule) {
    return dates
      .map((startDateMs) => {
        const endDateMs = startDateMs + duration;
        const startDateInfo = getDateInformation(startDateMs, timeZone);
        const endDateInfo = getDateInformation(endDateMs, timeZone);
        const [startDateFix, endDateFix] = getUnreachableShift(startDateInfo, endDateInfo);

        return {
          ...appointment,
          startDateUTC: startDateMs + startDateFix + startDateInfo.offsetMs,
          endDateUTC: endDateMs + endDateFix + endDateInfo.offsetMs,
        };
      });
  }

  const startDateAppointmentOffsetBase = getDateOffsetMs(startDateUTC, startDateTimeZone);
  const endDateAppointmentOffsetBase = getDateOffsetMs(endDateUTC, endDateTimeZone);
  const exceptionDates = new Set(
    appointment.hasRecurrenceRule && appointment.recurrenceException
      ? appointment.recurrenceException
        .split(',')
        .map((date) => getDateByAsciiString(date))
        .map((date) => (date ? date.getTime() : 0))
      : [],
  );

  return dates
    .map((startDateMs) => {
      // NOTE: Appointment can cross DST in Target timezone or in Appointment timezone,
      // so we need to calculate DST changes for both startDate and endDate
      const endDateMs = startDateMs + duration;
      const startDateInfo = getDateInformation(startDateMs, timeZone);
      const startDateAppointmentOffset = getDateOffsetMs(startDateMs, startDateTimeZone);
      const startDateDSTChange = (startDateOffsetBase - startDateInfo.offsetMs)
        + (startDateAppointmentOffsetBase - startDateAppointmentOffset);

      const endDateInfo = getDateInformation(endDateMs, timeZone);
      const endDateAppointmentOffset = getDateOffsetMs(endDateMs, endDateTimeZone);
      const endDateDSTChange = (startDateOffsetBase - endDateInfo.offsetMs)
        + (endDateAppointmentOffsetBase - endDateAppointmentOffset);

      const [startDateFix, endDateFix] = getUnreachableShift(startDateInfo, endDateInfo);
      const sourceStartDate = startDateMs + startDateDSTChange;
      const sourceEndDate = endDateMs + endDateDSTChange;

      return {
        ...appointment,
        sourceDatesBeforeSplit: {
          startDate: sourceStartDate,
          endDate: sourceEndDate,
        },
        startDateUTC: sourceStartDate + startDateFix + startDateInfo.offsetMs,
        endDateUTC: sourceEndDate + endDateFix + endDateInfo.offsetMs,
      };
    })
    .filter((item) => !exceptionDates.has(item.sourceDatesBeforeSplit.startDate));
};
