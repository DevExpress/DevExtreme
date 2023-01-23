import { createContext } from 'react';
import { FormValidationResult } from '../types';

interface ValidationContextValue {
  validationResult?: FormValidationResult;
}

export const ValidationContext = createContext<ValidationContextValue | undefined>(
  undefined,
);
