import { createContext } from '@ts/core/r1/runtime/inferno';

export interface PaginationConfigContextValue {
  isGridCompatibilityMode?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @stylistic/max-len
export const PaginationConfigContext = createContext<PaginationConfigContextValue | undefined>(undefined) as any;
