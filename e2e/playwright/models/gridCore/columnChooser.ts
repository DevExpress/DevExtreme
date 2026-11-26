import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WidgetName } from '../types';
import GridModule from './module';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'column-chooser',
  checkbox: 'dx-checkbox',
  treeViewItem: 'dx-treeview-item',
  closeButton: 'dx-closebutton',
};

export default class ColumnChooser extends GridModule {
  public readonly body: Locator;

  public readonly content: Locator;

  constructor(element: Locator, widgetName: WidgetName) {
    super(element, widgetName);

    this.body = element.page().locator('body');
    this.content = this.element.locator(`.${CLASS.overlayContent}`);
  }

  public async expectOpened(present = true): Promise<void> {
    const wrapper = this.body
      .locator(`.${CLASS.overlayWrapper}.${this.addWidgetPrefix(CLASS.columnChooser)}`)
      .first();

    await (present ? expect(wrapper) : expect(wrapper).not).toBeAttached();
  }

  public getCheckbox(nth = 0): Locator {
    return this.content.locator(`.${CLASS.checkbox}`).nth(nth);
  }

  public getCloseButton(): Locator {
    return this.content.locator(`.${CLASS.closeButton}`);
  }

  public getColumn(index = 0): Locator {
    return this.content.locator(`.${CLASS.treeViewItem}`).nth(index);
  }
}
