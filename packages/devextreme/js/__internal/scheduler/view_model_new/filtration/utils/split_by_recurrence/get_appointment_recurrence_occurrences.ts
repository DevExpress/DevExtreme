import { getDateByAsciiString } from '../../../../recurrence/base';
import type { DateInterval, MinimalAppointmentEntity, UTCDates } from '../../../types';
import { generateRecurrenceUTCDates } from './generate_recurrence_utc_dates';
import type { DateInformation } from './get_date_information';
import { getDateInformation, getDateOffsetMs } from './get_date_information';

interface Options {
  firstDayOfWeek?: number;
  interval: DateInterval;
  timeZone: string;
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

const getDatesShiftedByTimezone = (
  startDateMs: number,
  endDateMs: number,
  timeZone: string,
): UTCDates => {
  const startDateInfo = getDateInformation(startDateMs, timeZone);
  const endDateInfo = getDateInformation(endDateMs, timeZone);
  const [startDateFix, endDateFix] = getUnreachableShift(startDateInfo, endDateInfo);

  return {
    startDateUTC: startDateMs + startDateFix + startDateInfo.offsetMs,
    endDateUTC: endDateMs + endDateFix + startDateInfo.offsetMs,
  };
};

export const getAppointmentRecurrenceOccurrences = <T extends MinimalAppointmentEntity >(
  appointment: T,
  {
    firstDayOfWeek,
    interval,
    timeZone,
  }: Options,
): (T & UTCDates)[] => {
  const {
    source: { startDate: startDateMsBase, endDate: endDateMsBase },
    startDateTimeZone, endDateTimeZone,
  } = appointment;

  if (!appointment.hasRecurrenceRule) {
    return [{
      ...appointment,
      ...getDatesShiftedByTimezone(startDateMsBase, endDateMsBase, timeZone),
    }];
  }

  const duration = endDateMsBase - startDateMsBase;
  const dates = generateRecurrenceUTCDates(appointment, {
    firstDayOfWeek,
    interval,
    timeZone,
  });
  const startDateOffsetBase = getDateOffsetMs(startDateMsBase, timeZone);
  const startDateAppointmentOffsetBase = getDateOffsetMs(startDateMsBase, startDateTimeZone);
  const endDateAppointmentOffsetBase = getDateOffsetMs(endDateMsBase, endDateTimeZone);
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
        source: {
          startDate: sourceStartDate,
          endDate: sourceEndDate,
        },
        startDateUTC: sourceStartDate + startDateFix + startDateInfo.offsetMs,
        endDateUTC: sourceEndDate + endDateFix + startDateInfo.offsetMs,
      };
    })
    .filter((item) => !exceptionDates.has(item.source.startDate));
};
