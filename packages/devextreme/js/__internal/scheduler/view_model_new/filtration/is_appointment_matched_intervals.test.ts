import {
  describe, expect, it,
} from '@jest/globals';

import {
  isAppointmentMatchedIntervals,
} from './is_appointment_matched_intervals';

const viewIntervals = [{
  min: new Date(2000, 0, 10).getTime(),
  max: new Date(2000, 0, 16).getTime(),
}];
const timeIntervals = [
  {
    min: new Date(2000, 0, 10, 3, 30).getTime(),
    max: new Date(2000, 0, 10, 10, 30).getTime(),
  }, {
    min: new Date(2000, 0, 11, 3, 30).getTime(),
    max: new Date(2000, 0, 11, 10, 30).getTime(),
  }, {
    min: new Date(2000, 0, 12, 3, 30).getTime(),
    max: new Date(2000, 0, 12, 10, 30).getTime(),
  }, {
    min: new Date(2000, 0, 13, 3, 30).getTime(),
    max: new Date(2000, 0, 13, 10, 30).getTime(),
  }, {
    min: new Date(2000, 0, 14, 3, 30).getTime(),
    max: new Date(2000, 0, 14, 10, 30).getTime(),
  }, {
    min: new Date(2000, 0, 15, 3, 30).getTime(),
    max: new Date(2000, 0, 15, 10, 30).getTime(),
  },
];

describe('isAppointmentMatchedIntervals', () => {
  it('should compare zero-duration appointment on start of the time interval', () => {
    expect(isAppointmentMatchedIntervals({
      startDate: timeIntervals[1].min,
      endDate: timeIntervals[1].min,
    }, timeIntervals)).toBe(true);
  });

  it('should compare zero-duration appointment on start of the view interval', () => {
    expect(isAppointmentMatchedIntervals({
      startDate: viewIntervals[0].min,
      endDate: viewIntervals[0].min,
    }, viewIntervals)).toBe(true);
  });

  describe.each([
    {
      title: 'one view interval',
      intervals: viewIntervals,
      isDateOnly: true,
    },
    {
      title: 'time intervals',
      intervals: timeIntervals,
      isDateOnly: false,
    },
  ])('$title', ({ intervals, isDateOnly }) => {
    it('should compare appointment before intervals', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(1999, 0, 10, 10).getTime(),
        endDate: new Date(1999, 0, 11, 5).getTime(),
      }, intervals)).toBe(false);
    });

    it('should compare appointment after intervals', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2001, 0, 10, 10).getTime(),
        endDate: new Date(2001, 0, 11, 5).getTime(),
      }, intervals)).toBe(false);
    });

    it('should compare appointment intersect interval by end date', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 9, 10).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
      }, intervals)).toBe(true);
    });

    it('should compare appointment intersect interval by end date (hours)', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 9, 5).getTime(),
        endDate: new Date(2000, 0, 10, 3, 0).getTime(),
      }, intervals)).toBe(isDateOnly);
    });

    it('should compare appointment intersect interval by end date (minutes)', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 9, 5).getTime(),
        endDate: new Date(2000, 0, 10, 3, 35).getTime(),
      }, intervals)).toBe(true);
    });

    it('should compare appointment intersect interval by start date', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 15, 5).getTime(),
        endDate: new Date(2000, 0, 16, 5).getTime(),
      }, intervals)).toBe(true);
    });

    it('should compare appointment intersect interval by start date (hours)', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 15, 10, 40).getTime(),
        endDate: new Date(2000, 0, 16, 3, 0).getTime(),
      }, intervals)).toBe(isDateOnly);
    });

    it('should compare appointment intersect interval by start date (minutes)', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 15, 10, 20).getTime(),
        endDate: new Date(2000, 0, 16, 3, 0).getTime(),
      }, intervals)).toBe(true);
    });

    it('should compare appointment inside interval', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 12, 5).getTime(),
        endDate: new Date(2000, 0, 12, 8).getTime(),
      }, intervals)).toBe(true);
    });

    it('should compare appointment inside gap between days', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 12, 23).getTime(),
        endDate: new Date(2000, 0, 13, 2).getTime(),
      }, intervals)).toBe(isDateOnly);
    });

    it('should compare appointment inside gap before interval same day', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 12, 1).getTime(),
        endDate: new Date(2000, 0, 12, 2).getTime(),
      }, intervals)).toBe(isDateOnly);
    });

    it('should compare appointment inside gap after interval same day', () => {
      expect(isAppointmentMatchedIntervals({
        startDate: new Date(2000, 0, 12, 11).getTime(),
        endDate: new Date(2000, 0, 12, 12).getTime(),
      }, intervals)).toBe(isDateOnly);
    });
  });

  it('should compare appointment hugging view interval', () => {
    expect(isAppointmentMatchedIntervals({
      startDate: new Date(2000, 0, 9, 12).getTime(),
      endDate: new Date(2000, 0, 17, 10).getTime(),
    }, viewIntervals)).toBe(true);
  });

  it('should compare appointment hugging time interval', () => {
    expect(isAppointmentMatchedIntervals({
      startDate: new Date(2000, 0, 12, 1).getTime(),
      endDate: new Date(2000, 0, 12, 12).getTime(),
    }, timeIntervals)).toBe(true);
  });
});
