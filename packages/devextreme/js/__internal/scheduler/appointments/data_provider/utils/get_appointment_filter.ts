import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator/calculator';
import { isAppointmentTakesAllDay } from '../../../r1/utils/index';
import type { AllDayPanelModeType, AppointmentDataItem } from '../../../types';
import type { ResourceLoader } from '../../../utils/loader/resource_loader';
import { getAppointmentsOccurrences } from './get_appointments_occurrences';
import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';
import { isAppointmentMatchedIntervals } from './is_appointment_matched_intervals';
import { isAppointmentMatchedResources } from './is_appointment_matched_resources';

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
  const baseCompareOptions = {
    startDayHour, endDayHour, min, max,
  };
  const visibleDateIntervals = getVisibleDateTimeIntervals({
    ...baseCompareOptions,
    isDateViewOnly: true,
  });
  const visibleTimeIntervals = getVisibleDateTimeIntervals({
    ...baseCompareOptions,
    isDateViewOnly: false,
  });

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

    const isDateViewOnly = !isTimeDateView || isAppointmentOccupiesAllDayPanel;
    const viewIntervals = isDateViewOnly ? visibleDateIntervals : visibleTimeIntervals;
    if (viewIntervals.length === 0) {
      return false;
    }

    if (!isAppointmentMatchedResources(appointment.rawAppointment, resources)) {
      return false;
    }

    const appointmentToCompare: AppointmentDataItem = {
      ...appointment,
      allDay: isAppointmentOccupiesAllDayPanel,
    };
    if (appointmentToCompare.allDay) {
      appointmentToCompare.startDate = dateUtils.trimTime(appointmentToCompare.startDate);
      appointmentToCompare.endDate = dateUtils.trimTime(appointmentToCompare.endDate);
      appointmentToCompare.endDate.setHours(23, 59, 59, 999);
    }
    appointmentToCompare.startDate = dateUtilsTs.addOffsets(
      appointmentToCompare.startDate,
      [-viewOffset],
    );
    appointmentToCompare.endDate = dateUtilsTs.addOffsets(
      appointmentToCompare.endDate,
      [-viewOffset],
    );

    const recurrenceInterval = {
      min: viewIntervals[0].min,
      max: viewIntervals[viewIntervals.length - 1].max,
    };
    const appointmentOccurrences = getAppointmentsOccurrences(
      appointmentToCompare,
      { firstDayOfWeek, interval: recurrenceInterval },
      timeZoneCalculator,
    );

    return appointmentOccurrences.some(
      (appointmentOccurrence) => isAppointmentMatchedIntervals(
        appointmentOccurrence,
        viewIntervals,
      ),
    );
  };
};
