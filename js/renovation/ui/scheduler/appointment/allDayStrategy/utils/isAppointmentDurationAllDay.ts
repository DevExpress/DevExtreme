import getAppointmentDurationInHours from './getAppointmentDurationInHours';
import getHours from './getHours';

const HOURS_IN_DAY = 24;

function isAppointmentDurationAllDay(
  appointmentStartDate: Date,
  appointmentEndDate: Date,
  viewStartDayHour: number,
  viewEndDayHour: number,
  isSchedulerTimezoneSet: boolean,
): boolean {
  const appointmentDurationInHours = getAppointmentDurationInHours(
    appointmentStartDate,
    appointmentEndDate,
  );
  const viewDurationInHours = viewEndDayHour - viewStartDayHour;
  const startDateHours = getHours(appointmentStartDate, isSchedulerTimezoneSet);
  const endDateHours = getHours(appointmentEndDate, isSchedulerTimezoneSet);

  if (appointmentDurationInHours >= HOURS_IN_DAY) {
    return true;
  }

  return appointmentDurationInHours >= viewDurationInHours
    && startDateHours <= viewStartDayHour
    && endDateHours >= viewEndDayHour;
}

export default isAppointmentDurationAllDay;
