import type { Properties as TextBoxProperties } from '@js/ui/text_box';
import dxTextBox from '@js/ui/text_box';

import { InfernoWrapper } from './widget_wrapper';

type TextBoxPropertiesInternal = TextBoxProperties & {
  updateValueTimeout?: number;
};

export class TextBox extends InfernoWrapper<TextBoxPropertiesInternal, dxTextBox> {
  protected getComponentFabric(): typeof dxTextBox {
    return dxTextBox;
  }
}
