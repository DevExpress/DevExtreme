import type { FilterOptions, MinimalAppointmentEntity } from '../types';
import { getAppointmentRecurrenceOccurrences } from './get_appointment_recurrence_occurrences';

export const splitByRecurrence = <T extends MinimalAppointmentEntity>(
  entities: T[],
  {
    timeZoneCalculator, firstDayOfWeek, allDayPanel, regularPanel,
  }: FilterOptions,
): T[] => entities.reduce<T[]>((acc, appointment) => {
    const intervals = appointment.allDay || appointment.isAllDayPanelOccupied
      ? allDayPanel.intervals
      : regularPanel.intervals;
    const recurrenceInterval = {
      min: intervals[0].min,
      max: intervals[intervals.length - 1].max,
    };
    const occurrences = getAppointmentRecurrenceOccurrences<T>(
      appointment,
      { firstDayOfWeek, interval: recurrenceInterval },
      timeZoneCalculator,
    );

    occurrences.forEach((occurrence) => {
      acc.push(occurrence);
    });

    return acc;
  }, []);
