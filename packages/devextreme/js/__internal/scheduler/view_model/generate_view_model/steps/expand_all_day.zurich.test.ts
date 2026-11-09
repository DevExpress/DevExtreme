/**
 * @timezone Europe/Zurich
 */

import { describe, expect, it } from '@jest/globals';

import { expandAllDayRegularPanel } from './expand_all_day';

describe('expandAllDayRegularPanel', () => {
  it('T1337427: should add exactly one day on the DST end day', () => {
    expect(expandAllDayRegularPanel([{
      allDay: true,
      startDateUTC: Date.UTC(2021, 9, 30, 23),
      endDateUTC: Date.UTC(2021, 9, 30, 23, 30),
    }])).toEqual([{
      allDay: true,
      startDateUTC: Date.UTC(2021, 9, 30, 23),
      endDateUTC: Date.UTC(2021, 9, 31, 23),
    }]);
  });

  it('T1337427: should add exactly one day on the DST start day', () => {
    expect(expandAllDayRegularPanel([{
      allDay: true,
      startDateUTC: Date.UTC(2021, 2, 28, 0),
      endDateUTC: Date.UTC(2021, 2, 28, 0, 30),
    }])).toEqual([{
      allDay: true,
      startDateUTC: Date.UTC(2021, 2, 28, 0),
      endDateUTC: Date.UTC(2021, 2, 29, 0),
    }]);
  });
});
