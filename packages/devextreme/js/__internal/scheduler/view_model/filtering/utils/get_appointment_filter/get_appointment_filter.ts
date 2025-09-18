import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator/calculator';
import { isAppointmentTakesAllDay } from '../../../../r1/utils/index';
import type { AppointmentDataItem } from '../../../../types';
import { isAppointmentMatchedIntervals } from '../../../../view_model_new/common/is_appointment_matched_intervals';
import { isAppointmentMatchedResources } from '../../../../view_model_new/filtration/utils/filter_by_attributes/is_appointment_matched_resources';
import type { FilterOptions } from '../type';
import { getAppointmentOccurrenceDates } from './get_appointment_occurrence_dates';
import { getAppointmentRecurrenceOccurrences } from './get_appointments_occurrences';

export const getAppointmentFilter = (
  filterOptions: FilterOptions,
  timeZoneCalculator: TimeZoneCalculator,
) => {
  const {
    firstDayOfWeek,
    resources,
    allDayPanelFilter,
    allDayPanelMode,
    supportAllDayRow,
    visibleDateIntervals,
    visibleTimeIntervals,
    viewOffset,
  } = filterOptions;

  return (appointment: AppointmentDataItem): boolean => {
    const isAppointmentVisible = appointment.visible ?? true;
    if (!isAppointmentVisible) {
      return false;
    }

    // NOTE: Long appointments in views without all-day panel
    // should not become all-day appointments
    const isAllDayAppointment = supportAllDayRow
      ? isAppointmentTakesAllDay(appointment, allDayPanelMode)
      : appointment.allDay;
    if (allDayPanelFilter !== undefined
      && isAllDayAppointment !== allDayPanelFilter) {
      return false;
    }

    const viewIntervals = isAllDayAppointment
      ? visibleDateIntervals
      : visibleTimeIntervals;
    if (viewIntervals.length === 0) {
      return false;
    }

    if (!isAppointmentMatchedResources(appointment.rawAppointment, resources)) {
      return false;
    }

    const recurrenceInterval = {
      min: viewIntervals[0].min,
      max: viewIntervals[viewIntervals.length - 1].max,
    };
    const appointmentOccurrences = getAppointmentRecurrenceOccurrences(
      {
        ...appointment,
        startDate: appointment.startDate.getTime(),
        endDate: appointment.endDate.getTime(),
        allDay: isAllDayAppointment,
      },
      { firstDayOfWeek, interval: recurrenceInterval },
      timeZoneCalculator,
    ).map((occurrence) => ({
      ...occurrence,
      ...getAppointmentOccurrenceDates(occurrence, viewOffset),
    }));

    return appointmentOccurrences.some(
      (appointmentOccurrence) => isAppointmentMatchedIntervals(
        appointmentOccurrence,
        viewIntervals,
      ),
    );
  };
};
