import { isObject } from '@js/core/utils/type';

import { VIEW_TYPES } from '../options/constants_view';
import type { SafeSchedulerOptions } from '../options/types';
import { divisibleBy, greaterThan, lessThan } from './common/index';
import { createValidatorRule } from './core/index';

export const endDayHourMustBeGreaterThanStartDayHour = createValidatorRule(
  'endDayHourGreaterThanStartDayHour',
  ({
    startDayHour, endDayHour,
  }: SafeSchedulerOptions) => greaterThan(endDayHour, startDayHour),
);

export const visibleIntervalMustBeDivisibleByCellDuration = createValidatorRule(
  'visibleIntervalMustBeDivisibleByCellDuration',
  ({
    cellDuration,
    startDayHour,
    endDayHour,
  }: SafeSchedulerOptions) => {
    const visibleInterval = (endDayHour - startDayHour) * 60;
    return divisibleBy(visibleInterval, cellDuration);
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
    return lessThan(cellDuration, visibleInterval, false);
  },
);

export const allViewsHasCorrectType = createValidatorRule(
  'allViewsHasCorrectType',
  (views: SafeSchedulerOptions['views']) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      const viewType = isObject(view) ? view.type : view;
      const isValidView = Boolean(viewType && VIEW_TYPES.includes(viewType));

      if (!isValidView) {
        return { arguments: [String(viewType)] };
      }
    }

    return true;
  },
);
