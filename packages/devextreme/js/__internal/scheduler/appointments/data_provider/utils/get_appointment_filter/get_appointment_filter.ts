import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator/calculator';
import { isAppointmentTakesAllDay } from '../../../../r1/utils/index';
import type { AppointmentDataItem } from '../../../../types';
import type { FilterOptions } from '../type';
import { getAppointmentsOccurrences } from './get_appointments_occurrences';
import { isAppointmentMatchedIntervals } from './is_appointment_matched_intervals';
import { isAppointmentMatchedResources } from './is_appointment_matched_resources';

export const getAppointmentFilter = (
  filterOptions: FilterOptions,
  timeZoneCalculator: TimeZoneCalculator,
) => {
  const {
    viewOffset,
    firstDayOfWeek,
    resources,
    allDayPanelFilter,
    allDayPanelMode,
    visibleDateIntervals,
    visibleTimeIntervals,
  } = filterOptions;

  return (appointment: AppointmentDataItem): boolean => {
    const isAppointmentVisible = appointment.visible ?? true;
    if (!isAppointmentVisible) {
      return false;
    }

    const isAppointmentOccupiesAllDayPanel = isAppointmentTakesAllDay(
      appointment,
      allDayPanelMode,
    );
    if (allDayPanelFilter !== undefined
      && isAppointmentOccupiesAllDayPanel !== allDayPanelFilter) {
      return false;
    }

    const viewIntervals = appointment.allDay
      ? visibleDateIntervals
      : visibleTimeIntervals;
    if (viewIntervals.length === 0) {
      return false;
    }

    if (!isAppointmentMatchedResources(appointment.rawAppointment, resources)) {
      return false;
    }

    const appointmentToCompare: AppointmentDataItem = {
      ...appointment,
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
