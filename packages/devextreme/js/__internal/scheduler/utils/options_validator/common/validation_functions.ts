export const isInteger = (value: number): boolean => Number.isInteger(value);

export const greaterThan = (
  value: number,
  minimalValue: number,
  strict = true,
): boolean => (strict
  ? value > minimalValue
  : value >= minimalValue);

export const lessThan = (
  value: number,
  maximalValue: number,
  strict = true,
): boolean => (strict
  ? value < maximalValue
  : value <= maximalValue);

export const inRange = (
  value: number,
  [from, to]: [from: number, to: number],
): boolean => value >= from && value <= to;

export const divisibleBy = (
  value: number,
  divider: number,
): boolean => value % divider === 0;
