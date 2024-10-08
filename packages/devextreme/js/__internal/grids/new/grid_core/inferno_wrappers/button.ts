import type { Properties as ButtonProperties } from '@js/ui/button';
import dxButton from '@js/ui/button';

import { InfernoWrapper } from './widget_wrapper';

export class Button extends InfernoWrapper<ButtonProperties, dxButton> {
  protected getComponentFabric(): typeof dxButton {
    return dxButton;
  }
}
