import { createContext } from '@devextreme-generator/declarations';

export interface ConfigContextValue { rtlEnabled?: boolean }
export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);
