import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';

const CLASS = {
  valueContainer: 'dx-radio-value-container',
  icon: 'dx-radiobutton-icon',
  checked: 'dx-radiobutton-checked',
};

export default class RadioButton {
  public readonly element: Locator;

  private readonly item: Locator;

  constructor(item: Locator) {
    this.item = item;
    this.element = item.locator(`:scope > .${CLASS.valueContainer} > .${CLASS.icon}`);
  }

  public expectChecked(present = true): Promise<void> {
    return expectClass(this.item, CLASS.checked, present);
  }
}
