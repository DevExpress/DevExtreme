import { createContext } from 'react';
import { createValidationEngine, ValidationEngine } from '../utils/validation-engine';

export const ValidationEngineContext = createContext<ValidationEngine>(
  createValidationEngine(),
);
