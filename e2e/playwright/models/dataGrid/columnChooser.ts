import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import FocusableElement from '../internal/focusable';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'dx-datagrid-column-chooser',
  checkbox: 'dx-checkbox',
  treeViewItem: 'dx-treeview-item',
};

export default class ColumnChooser extends FocusableElement {
  public readonly body: Locator;

  public readonly content: Locator;

  constructor(element: Locator) {
    super(element);

    this.body = element.page().locator('body');
    this.content = this.element.locator(`.${CLASS.overlayContent}`);
  }

  public async expectOpened(present = true): Promise<void> {
    const wrapper = this.body.locator(`.${CLASS.overlayWrapper}.${CLASS.columnChooser}`).first();

    await (present ? expect(wrapper) : expect(wrapper).not).toBeAttached();
  }

  public getCheckbox(nth = 0): Locator {
    return this.content.locator(`.${CLASS.checkbox}`).nth(nth);
  }

  public getColumn(index = 0): Locator {
    return this.content.locator(`.${CLASS.treeViewItem}`).nth(index);
  }
}
