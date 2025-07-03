import {
  describe, expect, it,
} from '@jest/globals';

import { createTimeZoneCalculator } from '../../../r1/timezone_calculator';
import { isRecurrenceAppointmentMatchedDateTime } from './isRecurrenceAppointmentMatchedDateTime';

const minDay = 10;
const maxDay = 20;
const startDayHour = 10;
const endDayHour = 20;
const viewportOptions = {
  firstDayOfWeek: 3,
  startDayHour,
  endDayHour,
  min: new Date(2000, 0, minDay, startDayHour),
  max: new Date(2000, 0, maxDay, endDayHour),
  isOnlyDateCheck: false,
};
const yearMs = new Date(2001, 0).getTime() - new Date(2000, 0).getTime();
const mockTimeZoneCalculator = createTimeZoneCalculator(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);

describe('isRecurrenceAppointmentMatchedDateTime', () => {
  it('should compare tiny appointment (occurrence) on one day view', () => {
    expect(isRecurrenceAppointmentMatchedDateTime({
      recurrenceRule: 'FREQ=DAILY',
      startDate: new Date(2000, 0, maxDay - 2, startDayHour + 1),
      endDate: new Date(2000, 0, maxDay - 2, endDayHour - 1),
      allDay: false,
    } as any, {
      ...viewportOptions,
      min: new Date(2000, 0, maxDay),
      max: new Date(2000, 0, maxDay),
    }, mockTimeZoneCalculator)).toBe(false);
  });

  it('should compare tiny appointment (occurrence) starts and ends inside the gap', () => {
    expect(isRecurrenceAppointmentMatchedDateTime({
      recurrenceRule: 'FREQ=DAILY',
      startDate: new Date(2000, 0, minDay - 2, endDayHour + 1),
      endDate: new Date(2000, 0, minDay - 3, startDayHour - 1),
      allDay: false,
    } as any, viewportOptions, mockTimeZoneCalculator)).toBe(false);
  });

  it.each([
    { title: 'all day appointment', allDay: true },
    { title: 'several days appointment', allDay: false },
  ])('should compare $title starts and ends inside the gap', ({ allDay }) => {
    expect(isRecurrenceAppointmentMatchedDateTime({
      recurrenceRule: 'FREQ=DAILY',
      startDate: new Date(2000, 0, minDay - 3, endDayHour + 1),
      endDate: new Date(2000, 0, maxDay - 1, startDayHour - 1),
      allDay,
    } as any, { ...viewportOptions, isOnlyDateCheck: allDay }, mockTimeZoneCalculator)).toBe(true);
  });

  describe.each([
    {
      title: 'all day appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        allDay: true,
      },
      isTimeDateView: true,
      ignoreHours: true,
    },
    {
      title: 'several days appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        allDay: false,
      },
      isTimeDateView: true,
      ignoreHours: false,
    },
    {
      title: 'tiny appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 15, 11),
        allDay: false,
      },
      isTimeDateView: true,
      ignoreHours: false,
    },
    {
      title: 'tiny appointment in month view',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 15, 11),
        allDay: false,
      } as any,
      isTimeDateView: false,
      ignoreHours: true,
    },
  ])('1. $title', ({
    title, appointment, isTimeDateView, ignoreHours,
  }) => {
    const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

    it(`should compare ${title} less then start`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;COUNT=10',
        startDate: new Date(appointment.startDate.getTime() - yearMs),
        endDate: new Date(appointment.endDate.getTime() - yearMs),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(false);
    });

    it(`should compare ${title} greater then end`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY',
        startDate: new Date(appointment.startDate.getTime() + yearMs),
        endDate: new Date(appointment.endDate.getTime() + yearMs),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(false);
    });

    it(`should compare ${title} (occurrence) between start and date`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=5;COUNT=2',
        startDate: new Date(2000, 0, minDay - 4, startDayHour + 1),
        endDate: new Date(2000, 0, minDay + daysDuration - 4, startDayHour + 1, 30),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(true);
    });

    it(`should compare ${title} (occurrence) ends in start date (same day)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=5;COUNT=2',
        startDate: new Date(2000, 0, minDay - 5 - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay - 5, startDayHour + 1, 30),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(true);
    });

    it(`should compare ${title} (occurrence) starts in end date (same day)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, maxDay - 30, endDayHour - 1, 30),
        endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 1),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(true);
    });

    it(`should compare ${title} (occurrence) ends in start date (same hours)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, minDay - daysDuration - 30, startDayHour - 1),
        endDate: new Date(2000, 0, minDay - 30, startDayHour, 30),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(true);
    });

    it(`should compare ${title} (occurrence) starts in end date (same hours)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, maxDay - 30, endDayHour, 10),
        endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 1),
      }, {
        ...viewportOptions,
        endDayHour: endDayHour + 0.5,
        max: new Date(2000, 0, maxDay, endDayHour, 30),
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(true);
    });

    it(`should compare ${title} (occurrence) ends in start date (out of hours)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, minDay - daysDuration - 30, startDayHour - 2),
        endDate: new Date(2000, 0, minDay - 30, startDayHour - 1),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(ignoreHours);
    });

    it(`should compare ${title} (occurrence) starts in end date (out of hours)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, maxDay - 30, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 2),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(ignoreHours);
    });

    it(`should compare ${title} (occurrence) ends in start date (same hours, out of minutes)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, minDay - daysDuration - 30, startDayHour - 1),
        endDate: new Date(2000, 0, minDay - 30, startDayHour, 10),
      }, {
        ...viewportOptions,
        startDayHour: startDayHour + 0.5,
        min: new Date(2000, 0, minDay, startDayHour, 30),
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(ignoreHours);
    });

    it(`should compare ${title} (occurrence) starts in end date (same hours, out of minutes)`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, maxDay - 30, endDayHour, 10),
        endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 1),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(ignoreHours);
    });
  });

  describe.each([
    {
      title: 'all day appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        allDay: true,
      },
      isTimeDateView: true,
    },
    {
      title: 'several days appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        allDay: false,
      } as any,
      isTimeDateView: true,
    },
    {
      title: 'several days appointment in month view',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        allDay: false,
      } as any,
      isTimeDateView: false,
    },
  ])('2. $title', ({
    title, appointment, isTimeDateView,
  }) => {
    it(`should compare ${title} (occurrence) starts and ends outside the view`, () => {
      expect(isRecurrenceAppointmentMatchedDateTime({
        ...appointment,
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
        startDate: new Date(2000, 0, minDay - 1 - 30, startDayHour + 1),
        endDate: new Date(2000, 0, maxDay + 1 - 30, startDayHour + 2),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      }, mockTimeZoneCalculator)).toBe(true);
    });
  });
});
