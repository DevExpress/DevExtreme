import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from '../internal/classMatcher';
import CheckBox from '../checkBox';

const CLASS = {
  focused: 'dx-state-focused',
  checkbox: 'dx-checkbox',
  expandButton: 'dx-treeview-toggle-item-visibility',
};

export default class TreeViewNode {
  private readonly page: Page;

  public readonly element: Locator;

  constructor(page: Page, element: Locator) {
    this.page = page;
    this.element = element;
  }

  public async expectFocused(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.focused));
  }

  public getCheckBox(): CheckBox {
    return new CheckBox(this.page, this.element.locator(`.${CLASS.checkbox}`));
  }

  public getExpandButton(): Locator {
    return this.element.locator(`.${CLASS.expandButton}`);
  }
}
