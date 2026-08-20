import { describe, expect, it } from '@jest/globals';

import { expandAllDayAllDayPanel, expandAllDayRegularPanel } from './expand_all_day';

const defaultRegularPanelOptions = {
  startDayHour: 0,
  viewOffsetMs: 0,
  ignoreAllDayHours: false,
};

describe('expandAllDay', () => {
  describe('expandAllDayAllDayPanel', () => {
    it('should not expand regular appointment', () => {
      expect(expandAllDayAllDayPanel([{
        allDay: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }], 24, 0)).toEqual([
        {
          allDay: false,
          startDateUTC: Date.UTC(2020, 0, 10, 0),
          endDateUTC: Date.UTC(2020, 0, 10, 1),
        },
      ]);
    });

    it('should set end date to all day appointment without offset', () => {
      expect(expandAllDayAllDayPanel([
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
      ], 24, 0)).toEqual([
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
      expect(expandAllDayAllDayPanel([
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
      ], 24, 180 * 60_000)).toEqual([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 9, 3),
          endDateUTC: Date.UTC(2020, 0, 10, 2, 59),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 3),
          endDateUTC: Date.UTC(2020, 0, 12, 2, 59),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 3),
          endDateUTC: Date.UTC(2020, 0, 12, 2, 59),
        },
      ]);
    });
  });

  describe('expandAllDayRegularPanel', () => {
    it('should not expand regular appointment', () => {
      expect(expandAllDayRegularPanel([{
        allDay: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }], defaultRegularPanelOptions)).toEqual([
        {
          allDay: false,
          startDateUTC: Date.UTC(2020, 0, 10, 0),
          endDateUTC: Date.UTC(2020, 0, 10, 1),
        },
      ]);
    });

    it('should set +1 day from end date to all day appointment', () => {
      expect(expandAllDayRegularPanel([
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
          startDateUTC: Date.UTC(2020, 0, 11, 23),
          endDateUTC: Date.UTC(2020, 0, 12),
        },
      ], defaultRegularPanelOptions)).toEqual([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10),
          endDateUTC: Date.UTC(2020, 0, 11),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 4),
          endDateUTC: Date.UTC(2020, 0, 12, 4),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 11, 23),
          endDateUTC: Date.UTC(2020, 0, 13, 23),
        },
      ]);
    });

    it('should ignore hours in all day appointment dates when ignoreAllDayHours is true', () => {
      expect(expandAllDayRegularPanel([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 5),
          endDateUTC: Date.UTC(2020, 0, 10, 5),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 4),
          endDateUTC: Date.UTC(2020, 0, 11, 5),
        },
      ], {
        startDayHour: 8,
        viewOffsetMs: 0,
        ignoreAllDayHours: true,
      })).toEqual([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 8),
          endDateUTC: Date.UTC(2020, 0, 11, 8),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 8),
          endDateUTC: Date.UTC(2020, 0, 12, 8),
        },
      ]);
    });

    it('should ignore hours for timeline all day appointment the same way as for week view', () => {
      expect(expandAllDayRegularPanel([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 5),
          endDateUTC: Date.UTC(2020, 0, 10, 17),
        },
      ], {
        startDayHour: 0,
        viewOffsetMs: 0,
        ignoreAllDayHours: true,
      })).toEqual([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 0),
          endDateUTC: Date.UTC(2020, 0, 11, 0),
        },
      ]);
    });

    it('should map all day appointment to its calendar offset-day, ignoring hours', () => {
      expect(expandAllDayRegularPanel([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 20, 30),
          endDateUTC: Date.UTC(2020, 0, 10, 23, 30),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 2),
          endDateUTC: Date.UTC(2020, 0, 11, 2),
        },
      ], {
        startDayHour: 0,
        viewOffsetMs: -735 * 60_000,
        ignoreAllDayHours: true,
      })).toEqual([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 9, 11, 45),
          endDateUTC: Date.UTC(2020, 0, 10, 11, 45),
        }, {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 9, 11, 45),
          endDateUTC: Date.UTC(2020, 0, 11, 11, 45),
        },
      ]);
    });

    it('should keep all day appointment on its calendar day when offset is a full day', () => {
      expect(expandAllDayRegularPanel([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 10, 20, 30),
          endDateUTC: Date.UTC(2020, 0, 10, 23, 30),
        },
      ], {
        startDayHour: 0,
        viewOffsetMs: -1440 * 60_000,
        ignoreAllDayHours: true,
      })).toEqual([
        {
          allDay: true,
          startDateUTC: Date.UTC(2020, 0, 9, 0),
          endDateUTC: Date.UTC(2020, 0, 10, 0),
        },
      ]);
    });
  });
});
