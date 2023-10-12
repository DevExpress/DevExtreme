import { isDefined } from '../../../../../core/utils/type';
import dateUtils from '../../../../../core/utils/date';

// TODO Vinogradov refactoring: move this module to __internal.

export type AllDayPanelModeType = 'all' | 'allDay' | 'hidden';

const toMs = dateUtils.dateToMilliseconds;
const DAY_HOURS = 24;

const getDurationInHours = (
  startDate: Date,
  endDate: Date,
): number => Math.floor((endDate.getTime() - startDate.getTime()) / toMs('hour'));

export const getAppointmentTakesAllDay = (
  appointmentAdapter: {
    allDay: boolean;
    startDate: Date;
    endDate: Date | undefined | null;
  },
  allDayPanelMode: AllDayPanelModeType,
): boolean => {
  const {
    startDate,
    endDate,
    allDay,
  } = appointmentAdapter;

  switch (allDayPanelMode) {
    case 'hidden':
      return false;
    case 'allDay':
      return allDay;
    case 'all':
    default:
      if (allDay) {
        return true;
      }

      if (!isDefined(endDate)) {
        return false;
      }

      return getDurationInHours(startDate, endDate) >= DAY_HOURS;
  }
};
