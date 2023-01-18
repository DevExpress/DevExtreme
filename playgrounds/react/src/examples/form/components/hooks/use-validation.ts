import { useRef, useState } from 'react';
import { FormValidationResult, Rule } from '../types';

export function useValidation() {
  const [validationResult, setValidationResult] = useState<FormValidationResult>({});
  const validationRules = useRef<Record<string, Rule[]>>({});

  const validateValue = (name: string, value: unknown) => validationRules.current[name]?.filter(
    ({ validate }) => !validate(value),
  ).map(({ message }) => message);

  const validateEditor = (name: string, value: unknown) => {
    const result = validateValue(name, value);
    setValidationResult(previousResult => (
      { ...previousResult, [name]: result }));
  };

  const validateAll = (values: Record<string, unknown>) => {
    let isValid = true;
    const validationResults: FormValidationResult = {};
    Object.keys(validationRules.current).forEach((name) => {
      validationResults[name] = validateValue(name, values[name]);
      if (validationResults[name].length) {
        isValid = false;
      }
    });
    setValidationResult(validationResults);
    return isValid;
  };
  const initializeEditorRules = (name: string, rules: Rule[]) => {
    validationRules.current = { ...validationRules.current, [name]: rules };
  };

  return {
    validationResult,
    validateEditor,
    validateAll,
    initializeEditorRules,
  };
}
