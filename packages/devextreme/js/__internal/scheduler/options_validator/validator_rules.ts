import { divisibleBy, greaterThan, lessThan } from './common/index';
import { createValidatorRule } from './core/index';
import type { SchedulerOptions } from './types';

export const endDayHourMustBeGreaterThanStartDayHour = createValidatorRule(
  'endDayHourGreaterThanStartDayHour',
  ({
    startDayHour, endDayHour,
  }: SchedulerOptions) => greaterThan(endDayHour, startDayHour)
    || `endDayHour: ${endDayHour} must be greater that startDayHour: ${startDayHour}.`,
);

export const visibleIntervalMustBeDivisibleByCellDuration = createValidatorRule(
  'visibleIntervalMustBeDivisibleByCellDuration',
  ({
    cellDuration,
    startDayHour,
    endDayHour,
  }: SchedulerOptions) => {
    const visibleInterval = (endDayHour - startDayHour) * 60;
    return divisibleBy(visibleInterval, cellDuration)
    || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be divisible by cellDuration: ${cellDuration} (minutes).`;
  },
);

export const cellDurationMustBeLessThanVisibleInterval = createValidatorRule(
  'cellDurationMustBeLessThanVisibleInterval',
  ({
    cellDuration,
    startDayHour,
    endDayHour,
  }: SchedulerOptions) => {
    const visibleInterval = (endDayHour - startDayHour) * 60;
    return lessThan(cellDuration, visibleInterval, false)
    || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be greater or equal the cellDuration: ${cellDuration} (minutes).`;
  },
);
