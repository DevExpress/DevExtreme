import {
  describe, expect, it,
} from '@jest/globals';

import { compareDateWithTime } from './m_utils';

const minDay = 10;
const maxDay = 20;
const startDayHour = 10;
const endDayHour = 20;
const viewportOptions = {
  startDayHour,
  endDayHour,
  min: new Date(2000, 0, minDay),
  max: new Date(2000, 0, maxDay),
  isTimeDateView: true,
};
const yearMs = new Date(2001, 0).getTime() - new Date(2000, 0).getTime();

describe('compareDateWithTime', () => {
  describe.each([
    {
      title: 'all day appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        isAllDay: true,
      },
      ignoreHours: true,
    },
    {
      title: 'several days appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 17, 10, 30),
        isAllDay: false,
      },
      ignoreHours: false,
    },
    {
      title: 'tiny appointment',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 15, 11),
        isAllDay: false,
      },
      ignoreHours: false,
    },
    {
      title: 'tiny appointment in month view',
      appointment: {
        startDate: new Date(2000, 0, 15, 10, 30),
        endDate: new Date(2000, 0, 15, 11),
        isAllDay: false,
        isTimeDateView: false,
      },
      ignoreHours: true,
    },
  ])('$title', ({ title, appointment, ignoreHours }) => {
    const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

    it(`should compare ${title} less then start`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(appointment.startDate.getTime() - yearMs),
        endDate: new Date(appointment.endDate.getTime() - yearMs),
      })).toBe(false);
    });

    it(`should compare ${title} greater then end`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(appointment.startDate.getTime() + yearMs),
        endDate: new Date(appointment.endDate.getTime() + yearMs),
      })).toBe(false);
    });

    it(`should compare ${title} between start and date`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
      })).toBe(true);
    });

    it(`should compare ${title} ends in start date (same day)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay, startDayHour + 1, 30),
      })).toBe(true);
    });

    it(`should compare ${title} starts in end date (same day)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour - 1, 30),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
      })).toBe(true);
    });

    it(`should compare ${title} ends in start date (same hours)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay, startDayHour, 30),
      })).toBe(true);
    });

    it(`should compare ${title} starts in end date (same hours)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        endDayHour: endDayHour + 0.5,
        startDate: new Date(2000, 0, maxDay, endDayHour, 10),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
      })).toBe(true);
    });

    it(`should compare ${title} ends in start date (out of hours)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 2),
        endDate: new Date(2000, 0, minDay, startDayHour - 1),
      })).toBe(ignoreHours);
    });

    it(`should compare ${title} starts in end date (out of hours)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 2),
      })).toBe(ignoreHours);
    });

    it(`should compare ${title} ends in start date (same hours, out of minutes)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDayHour: startDayHour + 0.5,
        startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
        endDate: new Date(2000, 0, minDay, startDayHour, 10),
      })).toBe(ignoreHours);
    });

    it(`should compare ${title} starts in end date (same hours, out of minutes)`, () => {
      expect(compareDateWithTime({
        ...viewportOptions,
        ...appointment,
        startDate: new Date(2000, 0, maxDay, endDayHour, 10),
        endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
      })).toBe(ignoreHours);
    });
  });
});
