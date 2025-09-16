import { describe, expect, it } from '@jest/globals';

import { expandAllDay } from './expand_all_day';

describe('expandAllDay', () => {
  it('should not expand regular appointment', () => {
    expect(expandAllDay([
      {
        allDay: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }, {
        allDay: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      },
    ], 0)).toEqual([
      {
        allDay: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }, {
        allDay: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      },
    ]);
  });

  it('should set end date to 1ms after startDayHour=24 to all day appointment', () => {
    expect(expandAllDay([
      {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10),
        endDateUTC: Date.UTC(2020, 0, 10),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 11),
        endDateUTC: Date.UTC(2020, 0, 12),
      },
    ], 0)).toEqual([
      {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10),
        endDateUTC: Date.UTC(2020, 0, 10, 23, 59),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 23, 59),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 11),
        endDateUTC: Date.UTC(2020, 0, 12, 23, 59),
      },
    ]);
  });

  it('should set end date for all day appointment with offset', () => {
    expect(expandAllDay([
      {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10),
        endDateUTC: Date.UTC(2020, 0, 10),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 11),
        endDateUTC: Date.UTC(2020, 0, 12),
      },
    ], 180 * 60_000)).toEqual([
      {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10),
        endDateUTC: Date.UTC(2020, 0, 10, 2, 59),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 2, 59),
      }, {
        allDay: true,
        startDateUTC: Date.UTC(2020, 0, 11),
        endDateUTC: Date.UTC(2020, 0, 12, 2, 59),
      },
    ]);
  });
});
