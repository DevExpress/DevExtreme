import type { Properties as CheckBoxProperties } from '@js/ui/check_box';
import dxCheckBox from '@js/ui/check_box';

import { InfernoWrapper } from './widget_wrapper';

export class CheckBox extends InfernoWrapper<CheckBoxProperties, dxCheckBox> {
  protected getComponentFabric(): typeof dxCheckBox {
    return dxCheckBox;
  }
}
