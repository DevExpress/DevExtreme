import { createContext } from 'react';

export type ValidationGroupContextValue = string | symbol;

export const ValidationGroupContext = createContext<ValidationGroupContextValue | undefined>(
  undefined,
);
