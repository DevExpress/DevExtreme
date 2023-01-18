import { createContext } from 'react';

interface FormContextValue {
  onValueChanged: (name: string, value: unknown) => void;
}

export const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);
