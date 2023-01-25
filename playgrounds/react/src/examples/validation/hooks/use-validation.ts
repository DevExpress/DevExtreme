import { useState } from 'react';
import { FormValidationResult } from '../types';
import { ValidationEngine } from '../utils/validation-engine';

export function useValidation(validationEngine: ValidationEngine) {
  const [validationResult, setValidationResult] = useState<FormValidationResult>({});

  const validateEditor = (name: string, value: unknown) => {
    const result = validationEngine.validateValue(name, value);
    setValidationResult((previousResult) => ({
      ...previousResult,
      [name]: result,
    }));
  };

  const validateAll = (values: Record<string, unknown>) => {
    const engineResult = validationEngine.validateValues(values);
    setValidationResult(engineResult.results);
    return engineResult.isValid;
  };

  return {
    validationResult,
    validateEditor,
    validateAll,
  };
}
