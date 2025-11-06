import {
  afterEach,
  describe, expect, it, jest,
} from '@jest/globals';

import { VIEW_TYPES } from '../options/constants_view';
import type { SafeSchedulerOptions } from '../options/types';
import * as validationFunctions from './common/validation_functions';
import {
  allViewsHasCorrectType,
  cellDurationMustBeLessThanVisibleInterval,
  endDayHourMustBeGreaterThanStartDayHour,
  visibleIntervalMustBeDivisibleByCellDuration,
} from './validator_rules';

describe('validator rules', () => {
  describe('endDayHourMustBeGreaterThanStartDayHour', () => {
    const options = {
      startDayHour: 0,
      endDayHour: 24,
    } as SafeSchedulerOptions;
    const mock = jest.spyOn(validationFunctions, 'greaterThan');

    afterEach(() => {
      mock?.mockReset();
    });

    it('should call greaterThan function', () => {
      endDayHourMustBeGreaterThanStartDayHour(options);

      expect(mock).toHaveBeenCalledWith(options.endDayHour, options.startDayHour);
    });

    it('should return true if valid', () => {
      mock?.mockImplementation(() => true);

      const result = endDayHourMustBeGreaterThanStartDayHour(options);

      expect(result).toBe(true);
    });

    it('should return error (string) if invalid', () => {
      mock?.mockImplementation(() => false);

      const result = endDayHourMustBeGreaterThanStartDayHour(
        { startDayHour: 10, endDayHour: 9 } as SafeSchedulerOptions,
      );

      expect(result).toBe(false);
    });

    it('should be the function with the correct name', () => {
      const func = endDayHourMustBeGreaterThanStartDayHour;

      expect(func.name).toBe('endDayHourGreaterThanStartDayHour');
    });
  });

  describe('visibleIntervalMustBeDivisibleByCellDuration', () => {
    const options = {
      cellDuration: 30,
      startDayHour: 0,
      endDayHour: 24,
    } as SafeSchedulerOptions;
    const mock = jest.spyOn(validationFunctions, 'divisibleBy');

    afterEach(() => {
      mock?.mockReset();
    });

    it('should call divisibleBy function with correct values', () => {
      visibleIntervalMustBeDivisibleByCellDuration(options);

      expect(mock).toHaveBeenCalledWith(1440, options.cellDuration);
    });

    it('should return true if valid', () => {
      mock?.mockImplementation(() => true);

      const result = visibleIntervalMustBeDivisibleByCellDuration(options);

      expect(result).toBe(true);
    });

    it('should return error (string) if invalid', () => {
      mock?.mockImplementation(() => false);

      const result = visibleIntervalMustBeDivisibleByCellDuration(
        { cellDuration: 31, startDayHour: 9, endDayHour: 10 } as SafeSchedulerOptions,
      );

      expect(result).toBe(false);
    });

    it('should be the function with the correct name', () => {
      const func = visibleIntervalMustBeDivisibleByCellDuration;

      expect(func.name).toBe('visibleIntervalMustBeDivisibleByCellDuration');
    });
  });

  describe('cellDurationMustBeLessThanVisibleInterval', () => {
    const options = {
      cellDuration: 30,
      startDayHour: 0,
      endDayHour: 24,
    } as SafeSchedulerOptions;
    const mock = jest.spyOn(validationFunctions, 'lessThan');

    afterEach(() => {
      mock?.mockReset();
    });

    it('should call divisibleBy function with correct values', () => {
      cellDurationMustBeLessThanVisibleInterval(options);

      expect(mock).toHaveBeenCalledWith(options.cellDuration, 1440, false);
    });

    it('should return true if valid', () => {
      mock?.mockImplementation(() => true);

      const result = cellDurationMustBeLessThanVisibleInterval(options);

      expect(result).toBe(true);
    });

    it('should return error (string) if invalid', () => {
      mock?.mockImplementation(() => false);

      const result = cellDurationMustBeLessThanVisibleInterval(
        { cellDuration: 120, startDayHour: 9, endDayHour: 10 } as SafeSchedulerOptions,
      );

      expect(result).toBe(false);
    });

    it('should be the function with the correct name', () => {
      const func = cellDurationMustBeLessThanVisibleInterval;

      expect(func.name).toBe('cellDurationMustBeLessThanVisibleInterval');
    });
  });

  describe('allViewsHasCorrectType', () => {
    it('should return true for empty views', () => {
      expect(allViewsHasCorrectType([])).toBe(true);
    });

    it.each(VIEW_TYPES)('should return true for %s view', (viewType) => {
      expect(allViewsHasCorrectType([
        { type: 'day' },
        { type: 'week' },
        { type: viewType },
      ])).toBe(true);
    });

    it.each(VIEW_TYPES)('should return true for %s string view configuration', (viewType) => {
      expect(allViewsHasCorrectType([viewType])).toBe(true);
    });

    it('should return error for views with incorrect types', () => {
      expect(allViewsHasCorrectType([
        { type: 'day' },
        { type: 'orange' },
        { type: 'week' },
      ] as SafeSchedulerOptions['views'])).toEqual({
        arguments: ['\'orange\''],
      });
    });

    it('should return first error for views with incorrect types', () => {
      expect(allViewsHasCorrectType([
        { type: 'day' },
        { type: 'orange' },
        { type: 'apple' },
        { type: 'week' },
      ] as SafeSchedulerOptions['views'])).toEqual({
        arguments: ['\'orange\', \'apple\''],
      });
    });

    it('should be the function with the correct name', () => {
      const func = allViewsHasCorrectType;

      expect(func.name).toBe('allViewsHasCorrectType');
    });
  });
});
