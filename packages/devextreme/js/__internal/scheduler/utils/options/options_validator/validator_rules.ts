import { isObject } from '@js/core/utils/type';

import { VIEWS } from '../constants_view';
import type { SafeSchedulerOptions } from '../types';
import { divisibleBy, greaterThan, lessThan } from './common/index';
import { createValidatorRule } from './core/index';

export const endDayHourMustBeGreaterThanStartDayHour = createValidatorRule(
  'endDayHourGreaterThanStartDayHour',
  ({
    startDayHour, endDayHour,
  }: SafeSchedulerOptions) => greaterThan(endDayHour, startDayHour)
    || `endDayHour: ${endDayHour} must be greater that startDayHour: ${startDayHour}.`,
);

export const visibleIntervalMustBeDivisibleByCellDuration = createValidatorRule(
  'visibleIntervalMustBeDivisibleByCellDuration',
  ({
    cellDuration,
    startDayHour,
    endDayHour,
  }: SafeSchedulerOptions) => {
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
  }: SafeSchedulerOptions) => {
    const visibleInterval = (endDayHour - startDayHour) * 60;
    return lessThan(cellDuration, visibleInterval, false)
    || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be greater or equal the cellDuration: ${cellDuration} (minutes).`;
  },
);

export const allViewsHasCorrectType = createValidatorRule(
  'views',
  (views: SafeSchedulerOptions['views']) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      const viewType = isObject(view) ? view.type : view;
      const validTypes = Object.values(VIEWS);
      const isValidView = Boolean(viewType && validTypes.includes(viewType));

      if (!isValidView) {
        return {
          message: `The view type "${viewType}" is not supported. Supported types: ${validTypes.join(', ')}.`,
          arguments: [String(viewType)],
        };
      }
    }

    return true;
  },
);
