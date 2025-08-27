import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../../types';
import { isAppointmentMatchedIntervals } from './is_appointment_matched_intervals';

export const filterByIntervals = <T extends MinimalAppointmentEntity & AllDayPanelOccupation>(
  entities: T[],
  { regularPanel, allDayPanel }: FilterOptions,
): T[] => entities.filter((appointment) => {
    const intervals = appointment.allDay || appointment.isAllDayPanelOccupied
      ? allDayPanel.intervals
      : regularPanel.intervals;
    return isAppointmentMatchedIntervals(
      appointment,
      intervals,
    );
  });
