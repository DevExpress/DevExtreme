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
  (value: number) => isInteger(value) || `${value} must be an integer.`,
);

export const mustBeGreaterThan = (
  minimalValue: number,
  strict = true,
): ValidatorRule<number> => createValidatorRule(
  'mustBeGreaterThan',
  (value: number) => greaterThan(value, minimalValue, strict)
    || `${value} must be ${strict ? '>' : '>='} than ${minimalValue}.`,
);

export const mustBeLessThan = (
  maximalValue: number,
  strict = true,
): ValidatorRule<number> => createValidatorRule(
  'mustBeLessThan',
  (value: number) => lessThan(value, maximalValue, strict)
  || `${value} must be ${strict ? '<' : '<='} than ${maximalValue}.`,
);

export const mustBeInRange = (
  range: [from: number, to: number],
): ValidatorRule<number> => createValidatorRule(
  'mustBeInRange',
  (value: number) => inRange(value, range)
  || `${value} must be in range [${range[0]}, ${range[1]}].`,
);

export const mustBeDivisibleBy = (
  divider: number,
): ValidatorRule<number> => createValidatorRule(
  'mustBeDivisibleBy',
  (value: number) => divisibleBy(value, divider) || `${value} must be divisible by ${divider}.`,
);
