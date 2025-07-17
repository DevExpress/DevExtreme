import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator/calculator';
import { isAppointmentTakesAllDay } from '../../../../r1/utils/index';
import type { AppointmentDataItem } from '../../../../types';
import type { FilterOptions } from '../type';
import { getAppointmentsOccurrences } from './get_appointments_occurrences';
import { isAppointmentMatchedIntervals } from './is_appointment_matched_intervals';
import { isAppointmentMatchedResources } from './is_appointment_matched_resources';

const toMs = dateUtils.dateToMilliseconds;
const SECOND_MS = toMs('second');
const DAY_MS = toMs('day');
const DAY_WITHOUT_ONE_SECOND_MS = toMs('day') - toMs('second');

const getShiftedAllDayStartDate = (
  originalStartDate: Date,
  viewOffset: number,
): Date => {
  const trimmedDate = dateUtils.trimTime(originalStartDate);
  const startOfDay = dateUtilsTs.addOffsets(trimmedDate, [viewOffset]);
  const endOfDay = dateUtilsTs.addOffsets(trimmedDate, [DAY_WITHOUT_ONE_SECOND_MS, viewOffset]);

  switch (true) {
    case originalStartDate > endOfDay:
      return dateUtilsTs.addOffsets(endOfDay, [SECOND_MS]);
    case originalStartDate < startOfDay:
      return dateUtilsTs.addOffsets(startOfDay, [-DAY_MS]);
    // NOTE: originalStartDate in interval [startOfDay, endOfDay]
    // (include border points)
    default:
      return startOfDay;
  }
};

const getShiftedAllDayEndDate = (
  originalEndDate: Date,
  viewOffset: number,
): Date => {
  const trimmedDate = dateUtils.trimTime(originalEndDate);
  const startOfDay = dateUtilsTs.addOffsets(trimmedDate, [viewOffset]);
  const endOfDay = dateUtilsTs.addOffsets(trimmedDate, [DAY_WITHOUT_ONE_SECOND_MS, viewOffset]);

  switch (true) {
    case originalEndDate > endOfDay:
      return dateUtilsTs.addOffsets(endOfDay, [DAY_MS]);
    case originalEndDate < startOfDay:
      return dateUtilsTs.addOffsets(startOfDay, [-SECOND_MS]);
    // NOTE: originalEndDate in interval [startOfDay, endOfDay]
    // (include border points)
    default:
      return endOfDay;
  }
};

const getShiftedAppointmentOccurrenceDates = (
  {
    startDate: originalStartDate,
    endDate: originalEndDate,
    allDay,
  }: AppointmentDataItem,
  viewOffset: number,
): { startDate: Date; endDate: Date } => {
  switch (true) {
    // NOTE: For regular appointments -> return original dates
    case !allDay:
      return {
        startDate: originalStartDate,
        endDate: originalEndDate,
      };
    // NOTE: If viewOffset isn't set -> "round" dates
    // E.g: ['2024-02-01T10:00:00', '2024-02-02T11:00:00']
    // -> ['2024-02-01T00:00:00', '2024-02-02T23:59:59']
    case viewOffset === 0:
      return {
        startDate: dateUtils.trimTime(originalStartDate),
        endDate: dateUtilsTs.addOffsets(
          dateUtils.trimTime(originalEndDate),
          [DAY_WITHOUT_ONE_SECOND_MS],
        ),
      };
    // NOTE: allDay appointment + viewOffset is set case
    default:
      return {
        startDate: getShiftedAllDayStartDate(originalStartDate, viewOffset),
        endDate: getShiftedAllDayEndDate(originalEndDate, viewOffset),
      };
  }
};

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
    const appointmentOccurrences = getAppointmentsOccurrences(
      {
        ...appointment,
        allDay: isAllDayAppointment,
      },
      { firstDayOfWeek, interval: recurrenceInterval },
      timeZoneCalculator,
    ).map((occurrence) => ({
      ...occurrence,
      ...getShiftedAppointmentOccurrenceDates(occurrence, viewOffset),
    }));

    return appointmentOccurrences.some(
      (appointmentOccurrence) => isAppointmentMatchedIntervals(
        appointmentOccurrence,
        viewIntervals,
      ),
    );
  };
};
