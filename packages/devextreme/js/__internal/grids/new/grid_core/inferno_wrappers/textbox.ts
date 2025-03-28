import type { Properties as TextBoxProperties } from '@js/ui/text_box';
import dxTextBox from '@js/ui/text_box';

import { InfernoWrapper } from './widget_wrapper';

export class TextBox extends InfernoWrapper<TextBoxProperties, dxTextBox> {
  protected getComponentFabric(): typeof dxTextBox {
    return dxTextBox;
  }
}
