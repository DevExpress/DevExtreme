import { ValidationEngine } from '@devextreme/interim';
import { ValidationGroupContextValue } from '../contexts/validation-group-context';
import { Rule } from '../types';

export interface ValidationResult {
  isValid: boolean;
  results: Record<string, string[]>;
}

export interface DummyValidationEngine {
  initializeEditorRules: (
    name: string, rules: Rule[], group?: ValidationGroupContextValue
  ) => void;
  validateEditorValue: (name: string, value: unknown) => string[];
  validateEditorValues: (values: Record<string, unknown>) => ValidationResult;
}

export function createValidationEngine(): DummyValidationEngine {
  let validationRules: Record<string, Rule[]> = {};

  const initializeEditorRules = (
    name: string, rules: Rule[], group?: ValidationGroupContextValue,
  ) => {
    console.log(group);
    validationRules = { ...validationRules, [name]: rules };
  };

  const validateEditorValue = (
    editorName: string, editorValue: unknown,
  ) => {
    const validationResult = validationRules[editorName]
      ?.filter(({ validate }) => !validate(editorValue))
      .map(({ message }) => message);
    console.log({ editorName, editorValue, validationResult });
    return validationResult;
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

export function getValidationEngine(): ValidationEngine {
  return ValidationEngine;
}
