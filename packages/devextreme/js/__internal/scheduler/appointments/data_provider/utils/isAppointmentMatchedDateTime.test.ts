import {
  describe, expect, it,
} from '@jest/globals';

import { isAppointmentMatchedDateTime } from './isAppointmentMatchedDateTime';

const minDay = 10;
const maxDay = 20;
const startDayHour = 10;
const endDayHour = 20;
const viewportOptions = {
  startDayHour,
  endDayHour,
  min: new Date(2000, 0, minDay),
  max: new Date(2000, 0, maxDay),
  isOnlyDateCheck: false,
};
const yearMs = new Date(2001, 0).getTime() - new Date(2000, 0).getTime();

describe('isAppointmentMatchedDateTime', () => {
  it('should compare tiny appointment on one day view', () => {
    expect(isAppointmentMatchedDateTime({
      startDate: new Date(2000, 0, maxDay, startDayHour + 1),
      endDate: new Date(2000, 0, maxDay, endDayHour - 1),
      allDay: false,
    } as any, {
      ...viewportOptions,
      min: new Date(2000, 0, maxDay),
      max: new Date(2000, 0, maxDay),
    })).toBe(true);
  });

  it('should compare tiny appointment starts and ends inside the gap', () => {
    expect(isAppointmentMatchedDateTime({
      startDate: new Date(2000, 0, minDay + 1, endDayHour + 1),
      endDate: new Date(2000, 0, minDay + 2, startDayHour - 1),
      allDay: false,
    } as any, viewportOptions)).toBe(false);
  });

  it.each([
    { title: 'all day appointment', allDay: true },
    { title: 'several days appointment', allDay: false },
  ])('should compare $title starts and ends inside the gap', ({ allDay }) => {
    expect(isAppointmentMatchedDateTime({
      startDate: new Date(2000, 0, minDay + 1, endDayHour + 1),
      endDate: new Date(2000, 0, maxDay + 3, startDayHour - 1),
      allDay,
    } as any, { ...viewportOptions, isOnlyDateCheck: allDay })).toBe(true);
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
  ])('$title', ({
    title, appointment, isTimeDateView, ignoreHours,
  }) => {
    const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

    it(`should compare ${title} less then start`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(appointment.startDate.getTime() - yearMs),
        endDate: new Date(appointment.endDate.getTime() - yearMs),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(false);
    });

    it(`should compare ${title} greater then end`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(appointment.startDate.getTime() + yearMs),
        endDate: new Date(appointment.endDate.getTime() + yearMs),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(false);
    });

    it(`should compare ${title} between start and date`, () => {
      expect(isAppointmentMatchedDateTime(appointment, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(true);
    });

    it(`should compare ${title} ends in start date (same day)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay, startDayHour + 1, 30),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(true);
    });

    it(`should compare ${title} starts in end date (same day)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour - 1, 30),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(true);
    });

    it(`should compare ${title} ends in start date (same hours)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay, startDayHour, 30),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(true);
    });

    it(`should compare ${title} starts in end date (same hours)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour, 10),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
      }, {
        ...viewportOptions,
        endDayHour: endDayHour + 0.5,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(true);
    });

    it(`should compare ${title} ends in start date (out of hours)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 2),
        endDate: new Date(2000, 0, minDay, startDayHour - 1),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(ignoreHours);
    });

    it(`should compare ${title} starts in end date (out of hours)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 2),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(ignoreHours);
    });

    it(`should compare ${title} ends in start date (same hours, out of minutes)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay, startDayHour, 10),
      }, {
        ...viewportOptions,
        startDayHour: startDayHour + 0.5,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(ignoreHours);
    });

    it(`should compare ${title} starts in end date (same hours, out of minutes)`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour, 10),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(ignoreHours);
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
  ])('$title', ({
    title, appointment, isTimeDateView,
  }) => {
    it(`should compare ${title} starts and ends outside the view`, () => {
      expect(isAppointmentMatchedDateTime({
        ...appointment,
        startDate: new Date(2000, 0, minDay - 1, startDayHour + 1),
        endDate: new Date(2000, 0, maxDay + 1, startDayHour + 2),
      }, {
        ...viewportOptions,
        isOnlyDateCheck: !isTimeDateView || appointment.allDay,
      })).toBe(true);
    });
  });
});
