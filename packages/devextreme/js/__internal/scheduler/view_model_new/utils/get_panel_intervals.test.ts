import { describe, expect, it } from '@jest/globals';

import { getNextIntervalStartDate, getPanelIntervals, getPrevIntervalEndDate } from './get_panel_intervals';

describe('get panel intervals utils', () => {
  describe('getPrevIntervalEndDate', () => {
    it('should return correct prev end date for several intervals with gap', () => {
      expect(getPrevIntervalEndDate([{
        min: new Date(2000, 0, 10, 3, 30).getTime(),
        max: new Date(2000, 0, 10, 23, 30).getTime(),
      }, {
        min: new Date(2000, 0, 11, 3, 30).getTime(),
        max: new Date(2000, 0, 11, 23, 30).getTime(),
      }], false)).toEqual(new Date(2000, 0, 9, 23, 30).getTime());
    });

    it('should return correct prev end date for several intervals without gap', () => {
      expect(getPrevIntervalEndDate([{
        min: new Date(2000, 0, 10, 23, 30).getTime(),
        max: new Date(2000, 0, 11, 23, 30).getTime(),
      }, {
        min: new Date(2000, 0, 11, 23, 30).getTime(),
        max: new Date(2000, 0, 12, 23, 30).getTime(),
      }], false)).toEqual(new Date(2000, 0, 10, 23, 30).getTime());
    });

    it('should return correct prev end date for all day interval', () => {
      expect(getPrevIntervalEndDate([{
        min: new Date(2000, 0, 10, 0, 30).getTime(),
        max: new Date(2000, 0, 12, 0, 30).getTime(),
      }], true)).toEqual(new Date(2000, 0, 10, 0, 30).getTime());
    });
  });

  describe('getNextIntervalStartDate', () => {
    it('should return correct next start date for several intervals with gap', () => {
      expect(getNextIntervalStartDate([{
        min: new Date(2000, 0, 10, 3, 30).getTime(),
        max: new Date(2000, 0, 10, 23, 30).getTime(),
      }, {
        min: new Date(2000, 0, 11, 3, 30).getTime(),
        max: new Date(2000, 0, 11, 23, 30).getTime(),
      }], false)).toEqual(new Date(2000, 0, 12, 3, 30).getTime());
    });

    it('should return correct next start date for several intervals without gap', () => {
      expect(getNextIntervalStartDate([{
        min: new Date(2000, 0, 10, 23, 30).getTime(),
        max: new Date(2000, 0, 11, 23, 30).getTime(),
      }, {
        min: new Date(2000, 0, 11, 23, 30).getTime(),
        max: new Date(2000, 0, 12, 23, 30).getTime(),
      }], false)).toEqual(new Date(2000, 0, 12, 23, 30).getTime());
    });

    it('should return correct next start date for all day interval', () => {
      expect(getNextIntervalStartDate([{
        min: new Date(2000, 0, 10, 0, 30).getTime(),
        max: new Date(2000, 0, 12, 0, 30).getTime(),
      }], true)).toEqual(new Date(2000, 0, 12, 0, 30).getTime());
    });
  });

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
});
