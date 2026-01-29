import { describe, expect, it } from '@jest/globals';

import { expandAllDayAllDayPanel, expandAllDayRegularPanel } from './expand_all_day';

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
      }])).toEqual([
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
      ])).toEqual([
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
  });
});
