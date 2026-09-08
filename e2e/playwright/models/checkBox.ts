import type { WidgetName } from './types';
import Widget from './internal/widget';

export const CLASS = {
  checked: 'dx-checkbox-checked',
  indeterminate: 'dx-checkbox-indeterminate',
  icon: '.dx-checkbox-icon',
};

export default class CheckBox extends Widget {
  public static className = 'dx-checkbox';

  public isChecked(): Promise<boolean> {
    return this.hasClass(CLASS.checked);
  }

  public isIndeterminate(): Promise<boolean> {
    return this.hasClass(CLASS.indeterminate);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxCheckBox'; }
}
