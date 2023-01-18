import { createContext } from 'react';
import { FormValidationResult, Rule } from './types';

/*
  The validation-related props should move to the future validation context
  because the validation can be used separately from the form.
  Of course, the form should create validation context implicitly.
*/
interface FormContextValue {
  validationResult?: FormValidationResult;
  onValueChanged: (name: string, value: unknown) => void;
  onValidationRulesInitialized: (name: string, rules: Rule[]) => void;
}

export const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);
