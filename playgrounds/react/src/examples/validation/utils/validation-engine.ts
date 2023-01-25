import { Rule } from '../types';

export interface ValidationResult {
  isValid: boolean;
  results: Record<string, string[]>;
}

export interface ValidationEngine {
  initializeEditorRules: (name: string, rules: Rule[]) => void;
  validateValue: (name: string, value: unknown) => string[];
  validateEditorValue: (name: string, value: unknown) => void;
  validateValues: (values: Record<string, unknown>) => ValidationResult;
  getValidationResult: () => ValidationResult;
  validationResult: ValidationResult;
}

export function createValidationEngine(): ValidationEngine {
  let validationRules: Record<string, Rule[]> = {};
  let validationEngineResult: ValidationResult = {
    isValid: true,
    results: {},
  };

  const initializeEditorRules = (name: string, rules: Rule[]) => {
    validationRules = { ...validationRules, [name]: rules };
  };

  const updateValidationResult = ({ isValid, results }: ValidationResult) => {
    validationEngineResult = {
      isValid: validationEngineResult.isValid && isValid,
      results: { ...validationEngineResult.results, ...results },
    };
  };

  const validateValue = (name: string, value: unknown) => validationRules[name]
    ?.filter(({ validate }) => !validate(value))
    .map(({ message }) => message);

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

  const validateEditorValue = (name: string, value: unknown) => {
    const result = validateValue(name, value);
    updateValidationResult({
      isValid: !result || !result.length,
      results: { [name]: result },
    });
  };

  return {
    initializeEditorRules,
    validateValue,
    validateValues,
    validateEditorValue,
    getValidationResult: () => validationEngineResult,
    validationResult: validationEngineResult,
  };
}
