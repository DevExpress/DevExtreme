import { createContext } from 'react';
import { FormValidationResult, Rule } from './types';

interface FormContextValue {
  validationResult?: FormValidationResult;
  onValueChanged: (name: string, value: unknown) => void
  onValidationRulesInitialized: (name: string, rules: Rule[]) => void
}

export const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);
