import { isAppointmentMatchedIntervals } from '../../../common/is_appointment_matched_intervals';
import type {
  AllDayPanelOccupation,
  FilterOptions,
  MinimalAppointmentEntity,
  UTCDates,
} from '../../../types';

type Entity = MinimalAppointmentEntity & AllDayPanelOccupation & UTCDates;

export const filterByIntervals = <T extends Entity>(
  entities: T[],
  { allDayIntervals, regularIntervals }: FilterOptions,
): T[] => entities.filter((appointment) => {
    const intervals = appointment.allDay || appointment.isAllDayPanelOccupied
      ? allDayIntervals
      : regularIntervals;
    // NOTE: if all day appointment ends at 00:00 make it longer to occupy next interval
    const fixedAppointment = { ...appointment };
    if (appointment.allDay && appointment.isAllDayPanelOccupied) {
      fixedAppointment.endDateUTC += 1;
    }

    return isAppointmentMatchedIntervals(
      { startDate: fixedAppointment.startDateUTC, endDate: fixedAppointment.endDateUTC },
      intervals,
    );
  });
