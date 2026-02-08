import type { ValidatorRule } from '../core/index';
import { createValidatorRule } from '../core/index';
import {
  divisibleBy,
  greaterThan,
  inRange,
  isInteger,
  lessThan,
} from './validation_functions';

export const mustBeInteger: ValidatorRule<number> = createValidatorRule(
  'mustBeInteger',
  (value: number) => isInteger(value),
);

export const mustBeGreaterThan = (
  minimalValue: number,
  strict = true,
): ValidatorRule<number> => createValidatorRule(
  'mustBeGreaterThan',
  (value: number) => greaterThan(value, minimalValue, strict),
);

export const mustBeLessThan = (
  maximalValue: number,
  strict = true,
): ValidatorRule<number> => createValidatorRule(
  'mustBeLessThan',
  (value: number) => lessThan(value, maximalValue, strict),
);

export const mustBeInRange = (
  range: [from: number, to: number],
): ValidatorRule<number> => createValidatorRule(
  'mustBeInRange',
  (value: number) => inRange(value, range),
);

export const mustBeDivisibleBy = (
  divider: number,
): ValidatorRule<number> => createValidatorRule(
  'mustBeDivisibleBy',
  (value: number) => divisibleBy(value, divider),
);
