import { isDefined } from '../../../../../core/utils/type';
import dateUtils from '../../../../../core/utils/date';

export type ShowAllDayAppointmentsType = 'auto' | 'allDay' | 'none';

const getAppointmentDurationInHours = (
  startDate: Date,
  endDate: Date,
): number => (endDate.getTime() - startDate.getTime()) / dateUtils.dateToMilliseconds('hour');

const appointmentHasShortDayDuration = (
  startDate: Date,
  endDate: Date,
  viewStartDayHour: number,
  viewEndDayHour: number,
): boolean => {
  const appointmentDurationInHours = getAppointmentDurationInHours(startDate, endDate);
  const viewDurationInHours = viewEndDayHour - viewStartDayHour;
  const startDateHours = startDate.getHours();
  const endDateHours = endDate.getHours();

  return appointmentDurationInHours >= viewDurationInHours
    && startDateHours === viewStartDayHour
    && endDateHours === viewEndDayHour;
};

export const getAppointmentTakesAllDay = (
  appointmentAdapter: {
    allDay: boolean;
    startDate: Date;
    endDate: Date;
  },
  viewStartDayHour: number,
  viewEndDayHour: number,
  showAllDayAppointments: ShowAllDayAppointmentsType,
): boolean => {
  const hasAllDay = (): boolean => appointmentAdapter.allDay;

  return {
    none: (): boolean => false,
    allDay: hasAllDay,
    auto: (): boolean => {
      if (hasAllDay()) {
        return true;
      }

      const {
        startDate,
        endDate,
      } = appointmentAdapter;

      if (!isDefined(endDate)) {
        return false;
      }

      const appointmentDurationInHours = getAppointmentDurationInHours(
        startDate,
        endDate,
      );

      const dayDuration = 24;
      return appointmentDurationInHours >= dayDuration || appointmentHasShortDayDuration(
        startDate,
        endDate,
        viewStartDayHour,
        viewEndDayHour,
      );
    },
  }[showAllDayAppointments]();
};
