import { createContext } from '@devextreme/runtime/inferno';

export interface PaginationConfigContextValue {
  isGridCompatibilityMode?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
export const PaginationConfigContext = createContext<PaginationConfigContextValue | undefined>(undefined) as any;
