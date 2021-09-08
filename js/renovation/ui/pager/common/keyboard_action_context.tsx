import { createContext } from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { EventCallback } from '../../common/event_callback.d';

export interface KeyboardActionContextType {
  registerKeyboardAction: (el: HTMLElement, handler: EventCallback) => DisposeEffectReturn;
}
export const KeyboardActionContext = createContext<KeyboardActionContextType |
undefined>(undefined);
