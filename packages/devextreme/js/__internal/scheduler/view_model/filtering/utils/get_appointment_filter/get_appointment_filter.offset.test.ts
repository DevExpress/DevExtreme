import {
  describe, expect, it,
} from '@jest/globals';

import { createTimeZoneCalculator } from '../../../../r1/timezone_calculator';
import { shiftIntervals } from '../../../../view_model_new/common/shift_intervals';
import { getVisibleDateTimeIntervals } from '../../../../view_model_new/filtration/utils/get_filter_options/get_visible_date_time_intervals';
import type { FilterOptions } from '../type';
import { getAppointmentFilter } from './get_appointment_filter';

const minDay = 10;
const maxDay = 20;
const compareOptions = {
  startDayHour: 0,
  endDayHour: 24,
  min: new Date(2000, 0, minDay).getTime(),
  max: new Date(2000, 0, maxDay, 24).getTime(),
  skippedDays: [],
};
const getViewportOptions = (options: Partial<FilterOptions>): FilterOptions => ({
  ...compareOptions,
  resources: [],
  viewOffset: 0,
  firstDayOfWeek: 1,
  allDayPanelMode: 'all' as any,
  supportAllDayRow: true,
  ...options,
  visibleDateIntervals: shiftIntervals(
    getVisibleDateTimeIntervals({
      ...compareOptions,
      ...options,
    }, true),
    options.viewOffset ?? 0,
  ),
  visibleTimeIntervals: shiftIntervals(
    getVisibleDateTimeIntervals({
      ...compareOptions,
      ...options,
    }, false),
    options.viewOffset ?? 0,
  ),
});
const correctAppointment = {
  startDate: new Date(2000, 0, 15, 10),
  endDate: new Date(2000, 0, 15, 11),
  hasRecurrenceRule: false,
  allDay: false,
  visible: true,
  rawAppointment: {
    startDate: new Date(2000, 0, 15, 10),
    endDate: new Date(2000, 0, 15, 11),
  },
};
const mockTimeZoneCalculator = createTimeZoneCalculator(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);
const MS_IN_HOUR = 3_600_000;

describe('getAppointmentFilter', () => {
  [
    { caseName: 'all day appointment', isAllDay: true, durationDays: 0 },
    { caseName: 'long appointment', isAllDay: false, durationDays: 2 },
    { caseName: 'short appointment', isAllDay: false, durationDays: 0 },
  ].forEach(({ caseName, isAllDay, durationDays }) => {
    [12, -12].forEach((offsetInHours) => {
      const viewOffset = offsetInHours * MS_IN_HOUR;

      describe(`${caseName} ${offsetInHours} hours grid offset`, () => {
        it('should filter appointment in the gap between intervals', () => {
          const endDayHour = 20;
          const startDayHour = 10;

          expect(getAppointmentFilter(
            getViewportOptions({
              viewOffset: offsetInHours * MS_IN_HOUR,
              endDayHour,
              startDayHour,
            }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, minDay + 1, endDayHour + 1 - offsetInHours),
            endDate: new Date(2000, 0, minDay + 2 + durationDays, startDayHour - 1 - offsetInHours),
            allDay: isAllDay,
          })).toBe(isAllDay || durationDays > 0);
        });

        it('should filter appointment near the interval start', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, minDay - durationDays, offsetInHours),
            endDate: new Date(2000, 0, minDay, 1 + offsetInHours),
            allDay: isAllDay,
          })).toBe(true);
        });

        it('should filter appointment cross the interval start', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, minDay - durationDays, -1 + offsetInHours, 30),
            endDate: new Date(2000, 0, minDay, offsetInHours, 30),
            allDay: isAllDay,
          })).toBe(true);
        });

        // TODO(10): long appointment draw with zero width, but shouldn't draw at all
        (durationDays > 0 ? it.skip : it)('should filter appointment out of interval start', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, minDay - durationDays, -1 + offsetInHours),
            endDate: new Date(2000, 0, minDay, offsetInHours),
            allDay: isAllDay,
          })).toBe(isAllDay);
        });

        it('should filter appointment with day less then interval start', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, minDay - durationDays - 1),
            endDate: new Date(2000, 0, minDay - 1),
            allDay: isAllDay,
          })).toBe(false);
        });

        it('should filter appointment near the interval end', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, maxDay + 1, -1 + offsetInHours),
            endDate: new Date(2000, 0, maxDay + 1 + durationDays, offsetInHours),
            allDay: isAllDay,
          })).toBe(true);
        });

        it('should filter appointment out of interval end', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, maxDay + 1, offsetInHours),
            endDate: new Date(2000, 0, maxDay + 1 + durationDays, 1 + offsetInHours),
            allDay: isAllDay,
          })).toBe(false);
        });

        it('should filter appointment with day greater then interval end', () => {
          expect(getAppointmentFilter(
            getViewportOptions({ viewOffset }),
            mockTimeZoneCalculator,
          )({
            ...correctAppointment,
            startDate: new Date(2000, 0, maxDay + 2),
            endDate: new Date(2000, 0, maxDay + 2 + durationDays),
            allDay: isAllDay,
          })).toBe(false);
        });
      });
    });
  });
});
