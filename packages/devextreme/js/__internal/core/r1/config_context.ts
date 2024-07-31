import { createContext } from '@devextreme/runtime/inferno';

export interface ConfigContextValue { rtlEnabled?: boolean }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined) as any;
