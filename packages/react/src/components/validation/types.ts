import { ValidationResult } from '@devextreme/interim';

export type ValidationGroupId = string | symbol;

export type ValidationGroupRef = {
  validate: () => ValidationResult
};
