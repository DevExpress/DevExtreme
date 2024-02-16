import * as validationFunctions from './common/validation_functions';
import type { SchedulerOptions } from './types';
import {
  cellDurationMustBeLessThanVisibleInterval,
  endDayHourMustBeGreaterThanStartDayHour,
  visibleIntervalMustBeDivisibleByCellDuration,
} from './validator_rules';

describe('endDayHourMustBeGreaterThanStartDayHour', () => {
  const options = {
    startDayHour: 0,
    endDayHour: 24,
  } as SchedulerOptions;
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'greaterThan');
  });

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
      { startDayHour: 10, endDayHour: 9 } as SchedulerOptions,
    );

    expect(result).toBe('endDayHour: 9 must be greater that startDayHour: 10.');
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
  } as SchedulerOptions;
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'divisibleBy');
  });

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
      { cellDuration: 31, startDayHour: 9, endDayHour: 10 } as SchedulerOptions,
    );

    expect(result).toBe(
      'endDayHour - startDayHour: 60 (minutes), must be divisible by cellDuration: 31 (minutes).',
    );
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
  } as SchedulerOptions;
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'lessThan');
  });

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
      { cellDuration: 120, startDayHour: 9, endDayHour: 10 } as SchedulerOptions,
    );

    expect(result).toBe(
      'endDayHour - startDayHour: 60 (minutes), must be greater or equal the cellDuration: 120 (minutes).',
    );
  });

  it('should be the function with the correct name', () => {
    const func = cellDurationMustBeLessThanVisibleInterval;

    expect(func.name).toBe('cellDurationMustBeLessThanVisibleInterval');
  });
});
