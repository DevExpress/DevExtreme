import type { TimeZoneCalculator } from '../../../r1/timezone_calculator';
import type { AppointmentDataItem } from '../../../types';
import { getAppointmentsOccurrences } from './getAppointmentsOccurrences';
import {
  isAppointmentMatchedDateTime,
} from './isAppointmentMatchedDateTime';

interface CompareOptions {
  firstDayOfWeek: number;
  startDayHour: number;
  endDayHour: number;
  min: Date;
  max: Date;
  isOnlyDateCheck: boolean;
}

export const isRecurrenceAppointmentMatchedDateTime = (
  appointment: AppointmentDataItem,
  {
    firstDayOfWeek,
    startDayHour,
    endDayHour,
    min,
    max,
    isOnlyDateCheck,
  }: CompareOptions,
  timeZoneCalculator: TimeZoneCalculator,
): boolean => {
  const appointmentOccurrences = getAppointmentsOccurrences(
    appointment,
    {
      min,
      max,
      firstDayOfWeek,
      isOnlyDateCheck,
    },
    timeZoneCalculator,
  );

  return appointmentOccurrences.some((appointmentOccurrence) => isAppointmentMatchedDateTime({
    ...appointment,
    startDate: appointmentOccurrence.startDate,
    endDate: appointmentOccurrence.endDate,
  }, {
    startDayHour,
    endDayHour,
    min,
    max,
    isOnlyDateCheck,
  }));
};
