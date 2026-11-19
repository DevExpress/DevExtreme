import type { WidgetName } from './types';
import Widget from './internal/widget';

export const CLASS = {
  checked: 'dx-checkbox-checked',
  indeterminate: 'dx-checkbox-indeterminate',
  icon: '.dx-checkbox-icon',
};

export default class CheckBox extends Widget {
  name: WidgetName = 'dxCheckBox';

  public static className = 'dx-checkbox';

  public expectChecked(present = true): Promise<void> {
    return this.expectClass(CLASS.checked, present);
  }

  public expectIndeterminate(present = true): Promise<void> {
    return this.expectClass(CLASS.indeterminate, present);
  }
}
