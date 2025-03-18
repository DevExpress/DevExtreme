import { createContext } from '@ts/core/r1/runtime/inferno';
import type { Properties } from '@ts/core/widget/widget';

export interface Config {
  rtlEnabled: Properties['rtlEnabled'];
  disabled: Properties['disabled'];
  templatesRenderAsynchronously: unknown; // TODO: Properties['templatesRenderAsynchronously'];
}

export const ConfigContext = createContext<Config>({
  rtlEnabled: undefined,
  disabled: undefined,
  templatesRenderAsynchronously: undefined,
});
