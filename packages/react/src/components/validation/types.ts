import { ValidationResult, ValidationRule } from '@devextreme/interim';

export type ValidationGroupId = string | symbol;

export type ValidationGroupRef = {
  validate: () => ValidationResult
};

export interface ValidatorImpl {
  validate: () => ValidationResult,
  validationRules?: ValidationRule[],
  reset: () => void,
  on: (event: string, callback: () => void) => void,
  off: (event: string, callback: () => void) => void,
}
