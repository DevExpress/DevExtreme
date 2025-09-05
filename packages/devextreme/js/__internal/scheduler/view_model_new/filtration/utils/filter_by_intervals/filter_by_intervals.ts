import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../../types';
import { isAppointmentMatchedIntervals } from './is_appointment_matched_intervals';

export const filterByIntervals = <T extends MinimalAppointmentEntity & AllDayPanelOccupation>(
  entities: T[],
  { allDayIntervals, regularIntervals }: FilterOptions,
): T[] => entities.filter((appointment) => {
    const intervals = appointment.allDay || appointment.isAllDayPanelOccupied
      ? allDayIntervals
      : regularIntervals;
    return isAppointmentMatchedIntervals(
      appointment,
      intervals,
    );
  });
