import { ValidationEngine } from '@devextreme/interim';
import { createContext } from 'react';
import { getValidationEngine } from '../utils/validation-engine';

export const ValidationEngineContext = createContext<ValidationEngine>(getValidationEngine());
