import { Rule } from '../types';

export interface ValidationResult {
  isValid: boolean;
  results: Record<string, string[]>;
}

export interface ValidationEngine {
  initializeEditorRules: (name: string, rules: Rule[]) => void;
  validateEditorValue: (name: string, value: unknown) => string[];
  validateEditorValues: (values: Record<string, unknown>) => ValidationResult;
}

export function createValidationEngine(): ValidationEngine {
  let validationRules: Record<string, Rule[]> = {};

  const initializeEditorRules = (name: string, rules: Rule[]) => {
    validationRules = { ...validationRules, [name]: rules };
  };

  const validateEditorValue = (
    editorName: string, editorValue: unknown,
  ) => {
    console.log({ editorName, editorValue, rules: validationRules[editorName] });
    return validationRules[editorName]
      ?.filter(({ validate }) => !validate(editorValue))
      .map(({ message }) => message);
  };

  const validateEditorValues = (editorValues: Record<string, unknown>) => {
    const validationResult: ValidationResult = {
      isValid: true,
      results: {},
    };
    Object.keys(validationRules).forEach((name) => {
      validationResult.results[name] = validateEditorValue(name, editorValues[name]);
      if (validationResult.results[name].length) {
        validationResult.isValid = false;
      }
    });
    return validationResult;
  };

  return {
    initializeEditorRules,
    validateEditorValue,
    validateEditorValues,
  };
}
