import { createContext } from 'react';

export interface ValidationGroupContextValue {
  groupName: string ;
}

export const ValidationGroupContext = createContext<ValidationGroupContextValue | undefined>(
  undefined,
);
