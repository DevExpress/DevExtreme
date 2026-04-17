import errors from '@js/ui/widget/ui.errors';

import { isValidWeekday } from '../skipped_days';

const normalizeHiddenWeekDays = (
  days: unknown,
): number[] | undefined => {
  if (!Array.isArray(days)) {
    return undefined;
  }
  const valid = [...new Set(days)]
    .filter(isValidWeekday)
    .sort((a, b) => a - b);
  if (valid.length >= 7) {
    errors.log('W1029');
    return [];
  }
  return valid;
};

export const resolveSkippedDays = (
  perViewHiddenWeekDays: unknown,
  globalHiddenWeekDays: number[] | undefined,
  viewDefault: number[],
): number[] => {
  const perView = normalizeHiddenWeekDays(perViewHiddenWeekDays);
  if (perView !== undefined) {
    return perView;
  }
  if (globalHiddenWeekDays !== undefined) {
    return normalizeHiddenWeekDays(globalHiddenWeekDays) ?? [];
  }
  return viewDefault;
};
