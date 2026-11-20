import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';

const CLASS = {
  checkBox: 'dx-checkbox',
  checked: 'dx-checkbox-checked',
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

  // The list moves the focus between its items; the checkbox itself never takes it.
  public expectFocused(present = true): Promise<void> {
    return expectClass(this.item, CLASS.focused, present);
  }
}
