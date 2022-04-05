import dateUtils from '../../../../../core/utils/date';

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
  appointment: {
    allDay: boolean;
    startDate: Date;
    endDate: Date;
  },
  viewStartDayHour: number,
  viewEndDayHour: number,
): boolean => {
  const {
    allDay,
    startDate,
    endDate,
  } = appointment;

  if (allDay) {
    return true;
  }

  const dayDuration = 24;
  const appointmentDurationInHours = getAppointmentDurationInHours(
    startDate,
    endDate,
  );

  return appointmentDurationInHours >= dayDuration || appointmentHasShortDayDuration(
    startDate,
    endDate,
    viewStartDayHour,
    viewEndDayHour,
  );
};
