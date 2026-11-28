import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';
import { hasClass } from '../internal/hasClass';

const CLASS = {
  checkBox: 'dx-checkbox',
  checked: 'dx-checkbox-checked',
  indeterminate: 'dx-checkbox-indeterminate',
  focused: 'dx-state-focused',
};

export default class ListItemCheckBox {
  public readonly element: Locator;

  private readonly item: Locator;

  constructor(item: Locator) {
    this.item = item;
    this.element = item.locator(`.${CLASS.checkBox}`);
  }

  public expectChecked(present = true): Promise<void> {
    return expectClass(this.element, CLASS.checked, present);
  }

  public async getCheckBoxState(): Promise<'checked' | 'unchecked' | 'indeterminate'> {
    const isChecked = await hasClass(this.element, CLASS.checked);
    const isIndeterminate = await hasClass(this.element, CLASS.indeterminate);

    if (isChecked && !isIndeterminate) {
      return 'checked';
    }
    if (!isChecked && !isIndeterminate) {
      return 'unchecked';
    }
    if (!isChecked && isIndeterminate) {
      return 'indeterminate';
    }

    throw Error(`Invalid checkbox state. checked = ${isChecked}, indeterminate = ${isIndeterminate}`);
  }

  // The list moves the focus between its items; the checkbox itself never takes it.
  public expectFocused(present = true): Promise<void> {
    return expectClass(this.item, CLASS.focused, present);
  }
}
