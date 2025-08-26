import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  checked: 'dx-checkbox-checked',
};

export default class CheckBox extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxCheckBox'; }

  isChecked(): Promise<boolean> {
    return this.element.hasClass(CLASS.checked);
  }
}
