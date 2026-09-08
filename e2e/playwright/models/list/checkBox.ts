import type { Locator } from '@playwright/test';
import { hasClass } from '../internal/hasClass';

const CLASS = {
  checkbox: 'dx-checkbox',
  checkboxChecked: 'dx-checkbox-checked',
  indeterminate: 'dx-checkbox-indeterminate',
  focused: 'dx-state-focused',
};

export default class ListItemCheckBox {
  public readonly element: Locator;

  private readonly item: Locator;

  constructor(item: Locator) {
    this.item = item;
    this.element = item.locator(`.${CLASS.checkbox}`);
  }

  public isChecked(): Promise<boolean> {
    return hasClass(this.element, CLASS.checkboxChecked);
  }

  public isIndeterminate(): Promise<boolean> {
    return hasClass(this.element, CLASS.indeterminate);
  }

  public isFocused(): Promise<boolean> {
    return hasClass(this.item, CLASS.focused);
  }

  public async getCheckBoxState(): Promise<'checked' | 'unchecked' | 'indeterminate'> {
    const isChecked = await this.isChecked();
    const isIndeterminate = await this.isIndeterminate();

    if (isChecked && !isIndeterminate) {
      return 'checked';
    }
    if (!isChecked && !isIndeterminate) {
      return 'unchecked';
    }
    if (!isChecked && isIndeterminate) {
      return 'indeterminate';
    }

    throw new Error(`Invalid checkbox state. checked = ${isChecked}, indeterminate = ${isIndeterminate}`);
  }
}
