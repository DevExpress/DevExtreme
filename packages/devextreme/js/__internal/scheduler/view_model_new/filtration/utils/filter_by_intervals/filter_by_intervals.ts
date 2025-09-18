import { isAppointmentMatchedIntervals } from '../../../common/is_appointment_matched_intervals';
import type {
  AllDayPanelOccupation,
  DateInterval,
  FilterOptions,
  MinimalAppointmentEntity,
  UTCDates,
} from '../../../types';

type Entity = MinimalAppointmentEntity & AllDayPanelOccupation & UTCDates;

const getIntervals = <T extends Entity>(
  appointment: T,
  {
    allDayIntervals,
    regularIntervals,
    isDateTimeView,
  }: FilterOptions): DateInterval[] => {
  if (isDateTimeView && appointment.allDay) {
    return regularIntervals.map((interval) => ({
      min: new Date(interval.min).setUTCHours(0, 0, 0, 0),
      max: interval.max,
    }));
  }

  return appointment.allDay || appointment.isAllDayPanelOccupied
    ? allDayIntervals
    : regularIntervals;
};

export const filterByIntervals = <T extends Entity>(
  entities: T[],
  options: FilterOptions,
): T[] => entities.filter((appointment) => {
    const intervals = getIntervals(appointment, options);
    // NOTE: if all day appointment ends at 00:00 make it longer to occupy next interval
    const fixedAppointment = { ...appointment };
    if (appointment.allDay) {
      fixedAppointment.endDateUTC += 1;
    }

    return isAppointmentMatchedIntervals(
      { startDate: fixedAppointment.startDateUTC, endDate: fixedAppointment.endDateUTC },
      intervals,
    );
  });
