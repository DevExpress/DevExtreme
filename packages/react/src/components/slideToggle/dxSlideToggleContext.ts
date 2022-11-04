import React from 'react';
import { SlideToggleContractModels, SlideToggleStore } from '@devexpress/core/slideToggle';
import { ComponentContext, ContextCallbacks } from '../../internal/index';

type SlideToggleCallbacks = ContextCallbacks<SlideToggleContractModels>;
type SlideToggleContextType = ComponentContext<SlideToggleStore, SlideToggleContractModels>;

const SlideToggleContext = React.createContext<SlideToggleContextType | null>(null);

export type { SlideToggleCallbacks, SlideToggleContextType };
export { SlideToggleContext };
