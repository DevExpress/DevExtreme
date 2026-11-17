import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from '../internal/classMatcher';

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
    // The item's own icon: its content may hold nested radio buttons.
    this.element = item.locator(`:scope > .${CLASS.valueContainer} > .${CLASS.icon}`);
  }

  public async expectChecked(present = true): Promise<void> {
    const assertion = expect(this.item);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.checked));
  }
}
