import { createContext } from 'react';
import { PagerContractModels, PagerStore } from '@devexpress/core/pager';
import { ComponentContext, ContextCallbacks } from '../../internal/index';

type PagerCallbacks = ContextCallbacks<PagerContractModels>;
type PagerContextType = ComponentContext<PagerStore, PagerContractModels>;

const PagerContext = createContext<PagerContextType | null>(null);

export type { PagerCallbacks, PagerContextType };
export { PagerContext };
