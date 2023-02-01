import { ValidationRule } from '@devextreme/interim';
import { createContext } from 'react';

export interface ValidatorContextValue {
  registerRule: (rule: ValidationRule) => void ;
}

export const ValidatorContext = createContext<ValidatorContextValue | undefined>(undefined);
