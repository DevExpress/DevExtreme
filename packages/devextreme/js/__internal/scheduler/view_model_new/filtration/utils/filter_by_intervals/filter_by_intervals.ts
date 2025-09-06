import { isAppointmentMatchedIntervals } from '../../../common/is_appointment_matched_intervals';
import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../../types';

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
