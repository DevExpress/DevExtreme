import { describe, expect, it } from '@jest/globals';

import { getPanelIntervals } from './get_panel_intervals';

describe('getPanelIntervals', () => {
  it('should return correct intervals with offset for all day panel', () => {
    expect(getPanelIntervals(
      {
        startDayHour: 3,
        endDayHour: 23,
        min: new Date(2000, 0, 10, 3),
        max: new Date(2000, 0, 11, 23),
      },
      30 * 60_000,
      true,
      false,
    )).toEqual({
      intervals: [{
        min: new Date(2000, 0, 10, 0, 30).getTime(),
        max: new Date(2000, 0, 12, 0, 30).getTime(),
      }],
      prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
      nextIntervalStartDate: new Date(2000, 0, 12, 0, 30).getTime(),
    });
  });

  it('should return correct intervals with offset for regular panel', () => {
    expect(getPanelIntervals(
      {
        startDayHour: 3,
        endDayHour: 23,
        min: new Date(2000, 0, 10, 3),
        max: new Date(2000, 0, 11, 23),
      },
      30 * 60_000,
      false,
      false,
    )).toEqual({
      intervals: [{
        min: new Date(2000, 0, 10, 3, 30).getTime(),
        max: new Date(2000, 0, 10, 23, 30).getTime(),
      }, {
        min: new Date(2000, 0, 11, 3, 30).getTime(),
        max: new Date(2000, 0, 11, 23, 30).getTime(),
      }],
      prevIntervalEndDate: new Date(2000, 0, 9, 23, 30).getTime(),
      nextIntervalStartDate: new Date(2000, 0, 12, 3, 30).getTime(),
    });
  });

  it('should return correct intervals with offset for regular panel and all day intervals', () => {
    expect(getPanelIntervals(
      {
        startDayHour: 0,
        endDayHour: 24,
        min: new Date(2000, 0, 10),
        max: new Date(2000, 0, 12),
      },
      30 * 60_000,
      false,
      false,
    )).toEqual({
      intervals: [{
        min: new Date(2000, 0, 10, 0, 30).getTime(),
        max: new Date(2000, 0, 13, 0, 30).getTime(),
      }],
      prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
      nextIntervalStartDate: new Date(2000, 0, 13, 0, 30).getTime(),
    });
  });
});
