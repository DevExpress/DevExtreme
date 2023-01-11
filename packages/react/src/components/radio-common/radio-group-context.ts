import { RadioGroupStore } from '@devextreme/components';
import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RadioGroupContext = createContext<RadioGroupStore<any> | undefined>(undefined);
