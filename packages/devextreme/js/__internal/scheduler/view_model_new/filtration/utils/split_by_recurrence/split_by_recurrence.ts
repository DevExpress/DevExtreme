import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../../types';
import { getAppointmentRecurrenceOccurrences } from './get_appointment_recurrence_occurrences';

export const splitByRecurrence = <T extends MinimalAppointmentEntity & AllDayPanelOccupation>(
  entities: T[],
  {
    timeZone, firstDayOfWeek, allDayIntervals, regularIntervals,
  }: FilterOptions,
): T[] => entities.reduce<T[]>((acc, appointment) => {
    const intervals = appointment.allDay || appointment.isAllDayPanelOccupied
      ? allDayIntervals
      : regularIntervals;
    const recurrenceInterval = {
      min: intervals[0].min,
      max: intervals[intervals.length - 1].max,
    };
    const occurrences = getAppointmentRecurrenceOccurrences<T>(
      appointment,
      { firstDayOfWeek, interval: recurrenceInterval, timeZone },
    );

    acc.push(...occurrences);

    return acc;
  }, []);
