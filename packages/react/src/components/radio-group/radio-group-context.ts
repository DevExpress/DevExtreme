import { RadioGroupContextData } from '@devexpress/components';
import React from 'react';

export const RadioGroupContext = React.createContext<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
RadioGroupContextData<any> | undefined
>(undefined);
