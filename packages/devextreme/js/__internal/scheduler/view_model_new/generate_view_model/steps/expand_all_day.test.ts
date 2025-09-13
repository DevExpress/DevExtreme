import { describe, expect, it } from '@jest/globals';

import { expandAllDay } from './expand_all_day';

describe('expandAllDay', () => {
  it('should not expand regular appointment', () => {
    expect(expandAllDay([
      {
        allDay: false,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }, {
        allDay: false,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      },
    ], false)).toEqual([
      {
        allDay: false,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }, {
        allDay: false,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      },
    ]);
  });

  it('should just add 1ms to all day appointment for month view', () => {
    expect(expandAllDay([
      {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      },
    ], true)).toEqual([
      {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 24),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 24),
      },
    ]);
  });

  it('should just add 1ms to all day appointment in all day panel', () => {
    expect(expandAllDay([
      {
        allDay: true,
        isAllDayPanelOccupied: true,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 1),
      }, {
        allDay: true,
        isAllDayPanelOccupied: true,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      },
    ], false)).toEqual([
      {
        allDay: true,
        isAllDayPanelOccupied: true,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 24),
      }, {
        allDay: true,
        isAllDayPanelOccupied: true,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 24),
      },
    ]);
  });

  it('should expand all day appointment with from 0 hours', () => {
    expect(expandAllDay([
      {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 10, 0),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 11, 0),
      },
    ], false)).toEqual([
      {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 11, 0),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 0),
        endDateUTC: Date.UTC(2020, 0, 12, 0),
      },
    ]);
  });

  it('should expand all day appointment with from 4 AM', () => {
    expect(expandAllDay([
      {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 10, 5),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 5),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 12, 5),
      },
    ], false)).toEqual([
      {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 11, 4),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 12, 4),
      }, {
        allDay: true,
        isAllDayPanelOccupied: false,
        startDateUTC: Date.UTC(2020, 0, 10, 4),
        endDateUTC: Date.UTC(2020, 0, 13, 4),
      },
    ]);
  });
});
