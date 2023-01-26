import { createContext } from 'react';
import { Rule } from '../types';

export interface ValidatorContextValue {
  registerRule: (rule: Rule) => void ;
}

export const ValidatorContext = createContext<ValidatorContextValue | undefined>(undefined);
