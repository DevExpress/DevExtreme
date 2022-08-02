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

  switch (true) {
    case isAllDayAppointment:
      return true;
    case allDayAppointmentStrategy !== EAllDayAppointmentStrategy.allLongAppointment:
      return false;
    case !isDefined(endDate):
      return false;
    default:
      return isAppointmentDurationAllDay(
        startDate,
        endDate as Date,
        viewStartDayHour,
        viewEndDayHour,
        isSchedulerTimezoneSet,
      );
  }
}

export default isAllDayPanelAppointment;
