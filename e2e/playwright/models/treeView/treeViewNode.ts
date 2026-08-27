import type { Locator, Page } from '@playwright/test';
import { hasClass } from '../internal/hasClass';
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

  public isFocused(): Promise<boolean> {
    return hasClass(this.element, CLASS.focused);
  }

  public getCheckBox(): CheckBox {
    return new CheckBox(this.page, this.element.locator(`.${CLASS.checkbox}`));
  }

  public getExpandButton(): Locator {
    return this.element.locator(`.${CLASS.expandButton}`);
  }
}
