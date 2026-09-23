import { getDateByAsciiString } from '../../../../recurrence/base';
import type { DaylightPlan } from '../../../../utils/daylight_grid';
import type { DateInterval, MinimalAppointmentEntity, UTCDates } from '../../../types';
import { generateRecurrenceUTCDates } from './generate_recurrence_utc_dates';
import type { DateInformation } from './get_date_information';
import {
  getDateInformation,
  getDateOffsetMs,
  isCoveredByDaylightPlan,
  resolveFirstPass,
} from './get_date_information';

interface Options {
  firstDayOfWeek?: number;
  interval: DateInterval;
  timeZone: string;
  daylightPlan?: DaylightPlan;
}

// NOTE: When DST+1, then 2 AM equal 3 AM and interval [2 AM, 3 AM) is unreachable
// Recurrence is different because each occurrence has to have the same time in any timezone shift
const noShift = (): number[] => [0, 0];

const getUnreachableShiftRecurrence = (
  startDateInfo: DateInformation,
  endDateInfo: DateInformation,
  coveredByPlan: boolean,
): number[] => {
  if (coveredByPlan) {
    return noShift();
  }

  switch (true) {
    case startDateInfo.isUnreachableTime:
      return [startDateInfo.deltaMs, startDateInfo.deltaMs];
    case endDateInfo.isUnreachableTime:
      return [0, endDateInfo.deltaMs];
    default:
      return [0, 0];
  }
};

const getUnreachableShift = (
  startDateInfo: DateInformation,
  endDateInfo: DateInformation,
): number[] => {
  switch (true) {
    case startDateInfo.isUnreachableTime && endDateInfo.isUnreachableTime:
      return [startDateInfo.deltaMs, startDateInfo.deltaMs];
    case startDateInfo.isUnreachableTime:
      return [startDateInfo.deltaMs, 0];
    case endDateInfo.isUnreachableTime:
      return [0, endDateInfo.deltaMs];
    case endDateInfo.isDoubleTimeStart:
      return [0, -endDateInfo.deltaMs];
    default:
      return [0, 0];
  }
};

export const getAppointmentRecurrenceOccurrences = <T extends MinimalAppointmentEntity >(
  appointment: T,
  {
    firstDayOfWeek,
    interval,
    timeZone,
    daylightPlan,
  }: Options,
): (T & UTCDates)[] => {
  const {
    source: { startDate: startDateMsBase, endDate: endDateMsBase },
    startDateTimeZone, endDateTimeZone,
  } = appointment;

  if (!appointment.hasRecurrenceRule) {
    const startDateInfo = getDateInformation(startDateMsBase, timeZone);
    const endDateInfo = getDateInformation(endDateMsBase, timeZone);
    const [startDateFix, endDateFix] = getUnreachableShift(
      startDateInfo,
      endDateInfo,
    );

    return [{
      ...appointment,
      startDateUTC: startDateMsBase + startDateFix + startDateInfo.offsetMs,
      endDateUTC: endDateMsBase + endDateFix + endDateInfo.offsetMs,
    }];
  }

  const duration = endDateMsBase - startDateMsBase;
  const dates = generateRecurrenceUTCDates(appointment, {
    firstDayOfWeek,
    interval,
    timeZone,
    startDateTimeZone,
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
    .map((occurrenceStart) => {
      const startDateMs = occurrenceStart;
      const endDateMs = startDateMs + duration;
      const startDateInfo = getDateInformation(startDateMs, timeZone);
      const startDateAppointmentOffset = getDateOffsetMs(startDateMs, startDateTimeZone);

      const startChange = startDateOffsetBase - startDateInfo.offsetMs;
      const startAppointmentChange = startDateAppointmentOffsetBase - startDateAppointmentOffset;
      const startDateDSTChange = startDateTimeZone ? startAppointmentChange : startChange;

      const endDateInfo = getDateInformation(endDateMs, timeZone);
      const endDateAppointmentOffset = getDateOffsetMs(endDateMs, endDateTimeZone);

      const endChange = startDateOffsetBase - endDateInfo.offsetMs;
      const endAppointmentChange = endDateAppointmentOffsetBase - endDateAppointmentOffset;
      const endDateDSTChange = endDateTimeZone ? endAppointmentChange : endChange;

      // The offset correction runs first. A wall clock still in the repeated hour
      // then takes the first pass, so the two steps do not cancel each other.
      // If the first pass does not move the instant, keep the offset read at the
      // original occurrence. Re-reading it after the end was pulled onto the jump
      // would give the end the same offset as the start and drop the duration.
      const startInstant = startDateMs + startDateDSTChange;
      const endInstant = endDateMs + endDateDSTChange;
      const startResolved = resolveFirstPass(startInstant, timeZone);
      const endResolved = resolveFirstPass(endInstant, timeZone);
      const startOffsetMs = startResolved.instant === startInstant
        ? startDateInfo.offsetMs
        : startResolved.info.offsetMs;
      const endOffsetMs = endResolved.instant === endInstant
        ? endDateInfo.offsetMs
        : endResolved.info.offsetMs;
      const covered = isCoveredByDaylightPlan(daylightPlan, startResolved.instant)
        || isCoveredByDaylightPlan(daylightPlan, endResolved.instant);
      const [startDateFix, endDateFix] = getUnreachableShiftRecurrence(
        startDateInfo,
        endDateInfo,
        covered,
      );
      const sourceStartDate = startResolved.instant;
      const sourceEndDate = endResolved.instant;

      return {
        ...appointment,
        source: {
          startDate: sourceStartDate,
          endDate: sourceEndDate,
        },
        startDateUTC: sourceStartDate + startDateFix + startOffsetMs,
        endDateUTC: sourceEndDate + endDateFix + endOffsetMs,
      };
    })
    .filter((item) => !exceptionDates.has(item.source.startDate));
};
