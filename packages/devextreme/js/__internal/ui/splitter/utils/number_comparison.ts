import { toFixed } from '@js/common/core/localization/utils';

export const PRECISION = 10;

export function compareNumbersWithPrecision(
  actual: number,
  expected: number,
  precision: number = PRECISION,
): number {
  const delta = parseFloat(toFixed(actual, precision)) - parseFloat(toFixed(expected, precision));
  if (delta === 0) {
    return 0;
  }
  return delta > 0 ? 1 : -1;
}
