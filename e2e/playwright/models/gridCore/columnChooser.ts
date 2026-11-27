import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WidgetName } from '../types';
import { expectClass } from '../internal/classMatcher';
import GridModule from './module';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'column-chooser',
  checkbox: 'dx-checkbox',
  checkboxChecked: 'dx-checkbox-checked',
  stateDisabled: 'dx-state-disabled',
  treeViewItem: 'dx-treeview-item',
  closeButton: 'dx-closebutton',
  treeViewItemContent: 'dx-treeview-item-content',
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

  public expectCheckboxChecked(nth = 0, present = true): Promise<void> {
    return expectClass(this.getCheckbox(nth), CLASS.checkboxChecked, present);
  }

  public expectCheckboxDisabled(nth = 0, present = true): Promise<void> {
    return expectClass(this.getCheckbox(nth), CLASS.stateDisabled, present);
  }

  public getColumn(index = 0): Locator {
    return this.content.locator(`.${CLASS.treeViewItem}`).nth(index);
  }

  public getColumns(): Locator {
    return this.content.locator(`.${CLASS.treeViewItem}`);
  }

  public getColumnTexts(): Promise<string[]> {
    return this.getColumns().allTextContents();
  }

  public expectColumnDisabled(index = 0, present = true): Promise<void> {
    return expectClass(
      this.getColumn(index).locator(`.${CLASS.treeViewItemContent}`),
      CLASS.stateDisabled,
      present,
    );
  }
}
