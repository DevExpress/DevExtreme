import { createContext } from '@ts/core/r1/runtime/inferno/index';
import type { WidgetProperties } from '@ts/core/widget/widget';

export interface Config {
  rtlEnabled: WidgetProperties['rtlEnabled'];
  disabled: WidgetProperties['disabled'];
  templatesRenderAsynchronously: unknown; // TODO: Properties['templatesRenderAsynchronously'];
}

export const ConfigContext = createContext<Config>({
  rtlEnabled: undefined,
  disabled: undefined,
  templatesRenderAsynchronously: undefined,
});
