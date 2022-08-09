import { isDefined } from '../../../../../../core/utils/type';
import { EAllDayAppointmentStrategy } from '../types';
import { isAppointmentDurationAllDay } from '../utils/index';

function isAllDayPanelAppointment(
  appointmentAdapter: {
    allDay: boolean;
    startDate: Date;
    endDate: Date | undefined | null;
  },
  viewStartDayHour: number,
  viewEndDayHour: number,
  allDayAppointmentStrategy: EAllDayAppointmentStrategy,
  isSchedulerTimezoneSet: boolean,
): boolean {
  const isAllDayAppointment = appointmentAdapter.allDay;
  const {
    startDate,
    endDate,
  } = appointmentAdapter;

  if (isAllDayAppointment) {
    return true;
  }

  if (allDayAppointmentStrategy !== EAllDayAppointmentStrategy.allLongAppointment) {
    return false;
  }

  if (!isDefined(endDate)) {
    return false;
  }

  return isAppointmentDurationAllDay(
    startDate,
    endDate,
    viewStartDayHour,
    viewEndDayHour,
    isSchedulerTimezoneSet,
  );
}

export default isAllDayPanelAppointment;
