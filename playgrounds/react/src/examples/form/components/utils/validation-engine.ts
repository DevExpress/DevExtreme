import { Rule } from '../types';

export interface ValidationResult {
  isValid: boolean;
  results: Record<string, string[]>;
}

export interface ValidationEngine {
  initializeEditorRules: (name: string, rules: Rule[]) => void;
  validateValue: (name: string, value: unknown) => string[];
  validateValues: (values: Record<string, unknown>) => ValidationResult
}

export function createValidationEngine(): ValidationEngine {
  let validationRules: Record<string, Rule[]> = {};

  const initializeEditorRules = (name: string, rules: Rule[]) => {
    validationRules = { ...validationRules, [name]: rules };
  };

  const validateValue = (name: string, value: unknown) => validationRules[name]?.filter(
    ({ validate }) => !validate(value),
  ).map(({ message }) => message);

  const validateValues = (values: Record<string, unknown>) => {
    const validationResult: ValidationResult = {
      isValid: true,
      results: {},
    };
    Object.keys(validationRules).forEach((name) => {
      validationResult.results[name] = validateValue(name, values[name]);
      if (validationResult.results[name].length) {
        validationResult.isValid = false;
      }
    });
    return validationResult;
  };

  return { initializeEditorRules, validateValue, validateValues };
}
