import type { dxElementWrapper } from '@js/core/renderer';

import { createContext } from './context';

export interface TemplateStore {
  nodes: dxElementWrapper[];
}

export const templateContext = createContext<TemplateStore>();
