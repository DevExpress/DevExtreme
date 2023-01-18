import { createContext } from 'react';
import { FormValidationResult, Rule } from '../types';

interface ValidationContextValue {
  validationResult?: FormValidationResult;
  initializeEditorRules: (name: string, rules: Rule[]) => void;
}

export const ValidationContext = createContext<ValidationContextValue | undefined>(
  undefined,
);
