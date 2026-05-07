import { createContext } from '@ts/core/r1/runtime/inferno/index';

import type { EventCallback } from '../../core/r1/event_callback';
import type { DisposeEffectReturn } from '../../core/r1/utils/effect_return';

export interface KeyboardActionContextType {
  registerKeyboardAction: (el: HTMLElement, handler: EventCallback) => DisposeEffectReturn;
}

export const KeyboardActionContext = createContext<KeyboardActionContextType
| undefined>(undefined);
