import { createContext } from 'react';

export interface ValidationGroupContextValue {
  name?: string;
  group?: symbol;
}

export const ValidationGroupContext = createContext<ValidationGroupContextValue | undefined>(
  undefined,
);
