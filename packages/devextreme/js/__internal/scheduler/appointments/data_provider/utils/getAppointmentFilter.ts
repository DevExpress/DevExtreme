import { dateUtilsTs } from '@ts/core/utils/date';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator/calculator';
import { isAppointmentTakesAllDay } from '../../../r1/utils/index';
import type { AllDayPanelModeType, AppointmentDataItem } from '../../../types';
import type { ResourceLoader } from '../../../utils/loader/resource_loader';
import { getAppointmentsOccurrences } from './getAppointmentsOccurrences';
import { getVisibleDateIntervals } from './getVisibleDateIntervals';
import { getVisibleRecurrenceInterval } from './getVisibleRecurrenceInterval';
import { isAppointmentMatchedIntervals } from './isAppointmentMatchedIntervals';
import { isAppointmentMatchedResources } from './isAppointmentMatchedResources';

interface Options {
  startDayHour: number;
  endDayHour: number;
  viewOffset: number;
  resources: ResourceLoader[];
  firstDayOfWeek: number;
  isTimeDateView: boolean;
  min: Date | number | string;
  max: Date | number | string;
  allDay?: boolean;
  allDayPanelMode: AllDayPanelModeType;
}

export const getAppointmentFilter = (
  filterOptions: Options,
  timeZoneCalculator: TimeZoneCalculator,
) => {
  const min = new Date(filterOptions.min);
  const max = new Date(filterOptions.max);
  const {
    startDayHour,
    endDayHour,
    viewOffset,
    resources,
    firstDayOfWeek,
    isTimeDateView,
    allDay,
    allDayPanelMode,
  } = filterOptions;

  return (appointment: AppointmentDataItem): boolean => {
    const appointmentVisible = appointment.visible ?? true;
    if (!appointmentVisible) {
      return false;
    }

    const isAppointmentOccupiesAllDayPanel = isAppointmentTakesAllDay(
      appointment,
      allDayPanelMode,
    );
    if (isAppointmentOccupiesAllDayPanel && allDay === false) {
      return false;
    }

    if (!isAppointmentMatchedResources(appointment.rawAppointment, resources)) {
      return false;
    }

    const startDate = dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
    const endDate = dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);
    const appointmentToCompare: AppointmentDataItem = {
      ...appointment,
      startDate,
      endDate,
      allDay: isAppointmentOccupiesAllDayPanel,
    };
    const isOnlyDateCheck = !isTimeDateView || appointmentToCompare.allDay;

    const compareOptions = {
      startDayHour,
      endDayHour,
      min,
      max,
      isOnlyDateCheck,
    };
    const recurrenceInterval = getVisibleRecurrenceInterval(compareOptions);
    const appointmentOccurrences = getAppointmentsOccurrences(
      appointment,
      { firstDayOfWeek, interval: recurrenceInterval },
      timeZoneCalculator,
    );
    const viewIntervals = getVisibleDateIntervals(compareOptions);

    return appointmentOccurrences.some(
      (appointmentOccurrence) => isAppointmentMatchedIntervals(
        appointmentOccurrence,
        viewIntervals,
      ),
    );
  };
};
