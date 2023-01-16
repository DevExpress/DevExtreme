import { RadioGroupStore } from '@devextreme/components';
import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RadioGroupStoreContext = createContext<RadioGroupStore<any> | undefined>(undefined);
