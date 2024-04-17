export const PRECISION = 10;

export function compareNumbersWithPrecision(
  actual: number,
  expected: number,
  precision: number = PRECISION,
): number {
  const delta = parseFloat(actual.toFixed(precision)) - parseFloat(expected.toFixed(precision));
  if (delta === 0) {
    return 0;
  }
  return delta > 0 ? 1 : -1;
}
