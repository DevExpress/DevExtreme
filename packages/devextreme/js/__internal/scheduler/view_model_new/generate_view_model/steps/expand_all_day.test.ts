import { describe, expect, it } from '@jest/globals';

import { expandAllDay } from './expand_all_day';

describe('expandAllDay', () => {
  it('should not expand regular appointment', () => {
    expect(expandAllDay([
      {
        allDay: false,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 10, 1).getTime(),
      }, {
        allDay: false,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 11, 5).getTime(),
      },
    ], false)).toEqual([
      {
        allDay: false,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 10, 1).getTime(),
      }, {
        allDay: false,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 11, 5).getTime(),
      },
    ]);
  });

  it('should just add 1ms to all day appointment for month view', () => {
    expect(expandAllDay([
      {
        allDay: true,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 10, 1).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 11, 5).getTime(),
      },
    ], true)).toEqual([
      {
        allDay: true,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 10, 1).getTime() + 1,
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 11, 5).getTime() + 1,
      },
    ]);
  });

  it('should expand all day appointment with from 0 hours', () => {
    expect(expandAllDay([
      {
        allDay: true,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 10, 0).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 11, 0).getTime(),
      },
    ], false)).toEqual([
      {
        allDay: true,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 11, 0).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 0).getTime(),
        endDate: new Date(2020, 0, 12, 0).getTime(),
      },
    ]);
  });

  it('should expand all day appointment with from 4 AM', () => {
    expect(expandAllDay([
      {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 10, 5).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 11, 5).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 12, 5).getTime(),
      },
    ], false)).toEqual([
      {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 11, 4).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 12, 4).getTime(),
      }, {
        allDay: true,
        startDate: new Date(2020, 0, 10, 4).getTime(),
        endDate: new Date(2020, 0, 13, 4).getTime(),
      },
    ]);
  });
});
