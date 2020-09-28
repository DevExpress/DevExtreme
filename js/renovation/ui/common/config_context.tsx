import { createContext } from 'devextreme-generator/component_declaration/common';

export interface ConfigContextValue { rtlEnabled?: boolean }
export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);
